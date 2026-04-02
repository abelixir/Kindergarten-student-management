// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
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
  parentPhone: { 
    type: String, 
    trim: true 
  },

  // === NEW: Subjects with grades ===
  grades: {
    Maths: { type: String, default: "" },
    English: { type: String, default: "" },
    Amharic: { type: String, default: "" },
    Science: { type: String, default: "" },
    Art: { type: String, default: "" }
  },

  // Teacher's suggestion / note
  suggestions: { 
    type: String, 
    default: "" 
  }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);