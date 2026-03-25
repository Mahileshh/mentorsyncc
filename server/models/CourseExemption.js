const mongoose = require("mongoose");

const courseExemptionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subjectName: { type: String, required: true },
    reason: { type: String, required: true },
    certificationLink: { type: String, default: "" },
    creditCount: { type: Number, required: true, default: 3 },
    status: {
      type: String,
      enum: ["Pending Mentor", "Approved", "Rejected"],
      default: "Pending Mentor",
    },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);
module.exports = mongoose.models.CourseExemption || mongoose.model("CourseExemption", courseExemptionSchema);
