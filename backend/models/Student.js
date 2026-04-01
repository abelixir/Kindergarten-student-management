// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  classLevel: { 
    type: String, 
    required: true, 
    enum: ["KG1", "KG2", "KG3"] 
  },
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  parentPhone: { type: String, trim: true },

  // NEW FIELDS FOR TEACHER DASHBOARD
  grade: { type: String, default: "" },           // e.g. "A", "B+", "85"
  teacherSuggestion: { type: String, default: "" } // teacher's note / suggestion
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);