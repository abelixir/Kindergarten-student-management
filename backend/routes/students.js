const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const User = require("../models/User");

// GET students
router.get("/", async (req, res) => {
  const { classLevel, teacherId, parentId } = req.query;
  try {
    let query = {};
    if (classLevel) query.classLevel = classLevel;
    if (teacherId) query.teacherId = teacherId;
    if (parentId) query.parentId = parentId;

    const students = await Student.find(query)
      .populate("teacherId", "name")
      .populate("parentId", "name email");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Add student + create parent if needed
router.post("/", async (req, res) => {
  try {
    const { name, classLevel, parentName, parentEmail, parentPassword, parentPhone, teacherId } = req.body;

    if (!name || !classLevel || !parentEmail || !parentPassword || !parentPhone || !teacherId) {
      return res.status(400).json({ message: "Missing required fields: name, classLevel, parentEmail, parentPassword, parentPhone, teacherId" });
    }

    // Create or find parent
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
      parentPhone
    });

    await newStudent.save();

    const populatedStudent = await Student.findById(newStudent._id)
      .populate("teacherId", "name")
      .populate("parentId", "name email");

    res.json(populatedStudent);
  } catch (err) {
    console.error("Add student error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// PUT - Update student
router.put("/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate("teacherId", "name").populate("parentId", "name email");
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;