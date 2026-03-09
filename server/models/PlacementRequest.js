const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    package: { type: String, required: true },
    offerLetterUrl: { type: String, default: "" },
    remarks: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending Mentor", "Mentor Verified", "Rejected", "Officially Placed"],
      default: "Pending Mentor",
    },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlacementRequest", placementSchema);
