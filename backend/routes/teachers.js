// routes/teachers.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Student = require("../models/Student");

// GET all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    res.json(teachers);
  } catch (err) {
    console.error("Get teachers error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Add teacher
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTeacher = new User({ name, email, password, role: "teacher" });
    await newTeacher.save();

    const savedTeacher = await User.findById(newTeacher._id).select("-password");
    res.status(201).json(savedTeacher);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// PUT - Update teacher
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "Teacher not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update teacher error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE teacher + all his students + their parents
router.delete("/:id", async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const students = await Student.find({ teacherId: req.params.id });

    for (const student of students) {
      if (student.parentId) {
        const remainingStudents = await Student.countDocuments({
          parentId: student.parentId,
          _id: { $ne: student._id }
        });

        if (remainingStudents === 0) {
          await User.findByIdAndDelete(student.parentId);
        }
      }
      await Student.findByIdAndDelete(student._id);
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Teacher and all related students & parents deleted permanently." });
  } catch (err) {
    console.error("Delete teacher error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;