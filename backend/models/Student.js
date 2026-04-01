const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classLevel: { type: String, enum: ["KG1", "KG2", "KG3"], required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentPhone: { type: String, required: true },
  grades: {
    Maths: { type: String, enum: ["A", "B", "C", "D"], default: null },
    English: { type: String, enum: ["A", "B", "C", "D"], default: null },
    Amharic: { type: String, enum: ["A", "B", "C", "D"], default: null },
    Art: { type: String, enum: ["A", "B", "C", "D"], default: null },
    Science: { type: String, enum: ["A", "B", "C", "D"], default: null }
  },
  suggestions: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);