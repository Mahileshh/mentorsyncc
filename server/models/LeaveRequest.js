const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  fromDate: Date,
  toDate: Date,
  reason: String,
  leaveType: {
    type: String,
    default: "Leave",
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("LeaveRequest", leaveSchema);
