// backend/routes/teachers.js
const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");

// GET all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD teacher
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newTeacher = new Teacher({
      name,
      email,
      password,
      role: "teacher"
    });

    await newTeacher.save();
    res.json(newTeacher);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE teacher
router.put("/:id", async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE teacher
router.delete("/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;