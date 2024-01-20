const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();
const Task = require("../models/task");

//Create user API
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).send({user , token});
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//user login : 
router.post("/users/login",async (req , res)=>{
  try {
    const user = await User.findByCredentials(req.body.email , req.body.password);
    const token = await user.generateAuthToken();
    res.send({user , token});
  }catch(e){
    res.status(400).send(e.message);
  }
})

//Single User logout
router.post("/users/logout" , auth ,async (req , res)=>{
  try{
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token != req.token;
    });

    console.log("Logout API");

    await req.user.save();
    res.status(200).send("Succesfully Logged out!");
  }catch(e){
    res.status(500).send();
  }
})

//Logout All
router.post("/users/logoutAll", auth , async(req , res)=>{
  try{
    //Set tokens to an empty array
    req.user.tokens = [];
    await req.user.save();

    res.status(200).send("Succesfully logout all");
  }catch(e){
    res.status(500).send(e.message);
  }
})

//Read profile
router.get("/users/profile", auth, async (req, res) => {
  res.send(req.user);
});

//Read single user
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("user is not found");
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Update user
router.patch("/users/profile",auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);

  const isValidToUpdate = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidToUpdate) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    // const user = await User.findById(req.params.id);
    updates.forEach((update) => {
    req.user[update] = req.body[update];
    });
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Delete user
router.delete("/users/profile",auth ,async (req, res) => {
  try {
    await User.deleteOne(req.user._id);
    await Task.deleteMany({owner : req.user._id});
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});


module.exports = router;
