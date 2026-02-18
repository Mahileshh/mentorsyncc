const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  activity: String,
  points: Number,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("RewardPoint", rewardSchema);
