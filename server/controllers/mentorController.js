const Leave = require("../models/LeaveRequest");
const Placement = require("../models/PlacementRequest");

// Approve Leave
exports.approveLeave = async (req, res) => {
  const { leaveId, status } = req.body;

  await Leave.findByIdAndUpdate(leaveId, { status });

  res.json({ message: "Leave Updated" });
};

// Verify Placement (First Level)
exports.verifyPlacement = async (req, res) => {
  const { placementId } = req.body;

  await Placement.findByIdAndUpdate(placementId, {
    status: "Mentor Verified",
  });

  res.json({ message: "Placement Verified by Mentor" });
};
