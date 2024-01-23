const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const auth = require("../middleware/auth");
const {welcomeEmail , cancelEmail} = require("../emails/account");
const router = new express.Router();
const Task = require("../models/task");
const sharp = require("sharp");

//Create user API
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    welcomeEmail(user.email , user.name);
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//user login :
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Single User logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });

    console.log("Logout API");

    await req.user.save();
    res.status(200).send("Succesfully Logged out!");
  } catch (e) {
    res.status(500).send();
  }
});

//Logout All
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    //Set tokens to an empty array
    req.user.tokens = [];
    await req.user.save();

    res.status(200).send("Succesfully logout all");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

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
router.patch("/users/profile", auth, async (req, res) => {
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
router.delete("/users/profile", auth, async (req, res) => {
  try {
    await User.deleteOne(req.user._id);
    cancelEmail(req.user.email , req.user.name);
    await Task.deleteMany({ owner: req.user._id });
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

const upload = multer({
  
  limits: {
    fileSize: 1000000, //1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Pleas upload only jpg , jpeg & png images"));
    }

    cb(undefined, true);
  },
});

//Avatar CreateAPI : POST
router.post(
  "/users/profile/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.status(200).send("Avatar is uploaded seccussfully!");
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({"error": error.message});
  }
);

//Avatar Delete API : DELETE
router.delete("/users/profile/avatar",auth , async(req , res)=>{

  try{
    req.user.avatar = undefined;

    await req.user.save();

    res.send(req.user);
  }catch(e){
    res.status(500).send(e.message);
  }

})

//Serving Files(AVATAR) : GET
router.get("/users/:id/avatar" , async(req , res)=>{
  try{
    const user=await User.findById(req.params.id);
    if(!user || !user.avatar){
      throw new Error();
    }

    //specfiy header : which type of image is going to render on the browser
    res.set("Content-Type","image/png");
    res.send(user.avatar);
  }catch(e){
    res.status(404).send(e.message);
  }
})

module.exports = router;