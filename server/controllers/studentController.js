const Leave = require("../models/LeaveRequest");
const Placement = require("../models/PlacementRequest");

// Apply Leave
exports.applyLeave = async (req, res) => {
  const leave = await Leave.create(req.body);
  res.json(leave);
};

// Submit Placement
exports.submitPlacement = async (req, res) => {
  const placement = await Placement.create(req.body);
  res.json(placement);
};
