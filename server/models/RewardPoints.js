const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    description: { type: String, required: true },
    points:      { type: Number, required: true },
    addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RewardPoint", rewardSchema);
