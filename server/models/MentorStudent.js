const mongoose = require("mongoose");

const mentorStudentSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
});

module.exports = mongoose.model("MentorStudent", mentorStudentSchema);
