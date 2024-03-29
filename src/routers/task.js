const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();

//create task API
router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Read tasks /tasks?completed=true/false
//GET  /tasks?limit=20&skip=10
//GET /tasks?sortBy=createdAt-desc
router.get("/tasks", auth, async (req, res) => {
  //Sorting
  const match = {};
  const sort = {};

  console.log(req.query.sortBy)

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    parts = req.query.sortBy.split("-");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  console.log(sort);
  try {
    // const tasks = await Task.find({owner : req.user._id});
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        //pagination
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        //Sorting
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Read single task
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send("Task is not found");
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//Update task
router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const allowedUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);

  const isValidToUpdate = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidToUpdate) {
    return res.status(400).send({ error: "Invalid to Update!" });
  }

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      res.status(404).send("Task is not found!");
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Delete task
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

    if (!task) {
      res.status(404).send("Task not found");
    }

    res.send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
