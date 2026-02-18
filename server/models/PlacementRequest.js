const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  company: String,
  role: String,
  package: String,
  status: {
    type: String,
    enum: ["Pending Mentor", "Mentor Verified", "Officially Placed"],
    default: "Pending Mentor",
  },
});

module.exports = mongoose.model("PlacementRequest", placementSchema);
