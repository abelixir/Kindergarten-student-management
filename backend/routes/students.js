// routes/students.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const User = require("../models/User");

// GET students (with filters)
router.get("/", async (req, res) => {
  const { classLevel, teacherId, parentId } = req.query;
  try {
    let query = {};
    if (classLevel) query.classLevel = classLevel;
    if (teacherId) query.teacherId = teacherId;
    if (parentId) query.parentId = parentId;

    const students = await Student.find(query)
      .populate("teacherId", "name")
      .populate("parentId", "name email")
      .sort({ name: 1 }); // Sort alphabetically by name

    res.json(students);
  } catch (err) {
    console.error("Get students error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Add student + create parent
router.post("/", async (req, res) => {
  try {
    const { name, classLevel, parentName, parentEmail, parentPassword, parentPhone, teacherId } = req.body;

    if (!name || !classLevel || !parentEmail || !parentPassword || !parentPhone || !teacherId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let parent = await User.findOne({ email: parentEmail });
    if (!parent) {
      parent = new User({
        name: parentName || "Parent",
        email: parentEmail,
        password: parentPassword,
        role: "parent"
      });
      await parent.save();
    }

    const newStudent = new Student({
      name,
      classLevel,
      teacherId,
      parentId: parent._id,
      parentPhone,
      grades: {},        // initialize empty grades
      suggestions: ""
    });

    await newStudent.save();

    const populatedStudent = await Student.findById(newStudent._id)
      .populate("teacherId", "name")
      .populate("parentId", "name email");

    res.status(201).json(populatedStudent);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// PUT - Update student (grades, suggestions, basic info)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("teacherId", "name")
      .populate("parentId", "name email");

    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.parentId) {
      const otherStudentsCount = await Student.countDocuments({
        parentId: student.parentId,
        _id: { $ne: student._id }
      });
      if (otherStudentsCount === 0) {
        await User.findByIdAndDelete(student.parentId);
      }
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;