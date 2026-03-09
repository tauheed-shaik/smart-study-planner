import express from "express";
import Subject from "../models/Subject.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all subjects
router.get("/", authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user.userId });
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a subject
router.post("/", authMiddleware, async (req, res) => {
  const { name, color } = req.body;
  try {
    const newSubject = new Subject({
      name,
      color,
      user: req.user.userId,
    });
    const subject = await newSubject.save();
    res.json(subject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a subject
router.put("/:id", authMiddleware, async (req, res) => {
  const { name, color } = req.body;
  try {
    let subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ msg: "Subject not found" });

    if (subject.user.toString() !== req.user.userId)
      return res.status(401).json({ msg: "User not authorized" });

    subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $set: { name, color } },
      { new: true }
    );
    res.json(subject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a subject
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    let subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ msg: "Subject not found" });

    if (subject.user.toString() !== req.user.userId)
      return res.status(401).json({ msg: "User not authorized" });

    await Subject.findByIdAndDelete(req.params.id);
    res.json({ msg: "Subject removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
