const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  phone: String,
  batch: String,
  department: String,
  marks: Number,
  cgpa: Number,
  backlogs: Number,
  attendance: { type: Number, default: 75 },
  rewardPointsTotal: { type: Number, default: 0 },
});

module.exports = mongoose.model("Student", studentSchema);
