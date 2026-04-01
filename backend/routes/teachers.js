const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD teacher
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newTeacher = new User({ name, email, password, role: "teacher" });
    await newTeacher.save();
    const saved = await User.findById(newTeacher._id).select("-password");
    res.json(saved);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE teacher
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE teacher
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;