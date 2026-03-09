import express from "express";
import Task from "../models/Task.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }).populate(
      "subject",
      "name color"
    );
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, deadline, priority, status, subject } = req.body;
  try {
    const newTask = new Task({
      title,
      description,
      deadline,
      priority,
      status,
      subject,
      user: req.user.userId,
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a task
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description, deadline, priority, status } = req.body;
  const taskFields = {};
  if (title) taskFields.title = title;
  if (description) taskFields.description = description;
  if (deadline) taskFields.deadline = deadline;
  if (priority) taskFields.priority = priority;
  if (status) taskFields.status = status;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.user.toString() !== req.user.userId)
      return res.status(401).json({ msg: "User not authorized" });

    // Gamification: Add points if completing a task
    if (status === "completed" && task.status !== "completed") {
      await User.findByIdAndUpdate(req.user.userId, { $inc: { points: 10 } });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.user.toString() !== req.user.userId)
      return res.status(401).json({ msg: "User not authorized" });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
