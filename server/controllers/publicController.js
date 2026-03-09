const RewardPoint = require("../models/RewardPoints");
const LeaveRequest = require("../models/LeaveRequest");
const PlacementRequest = require("../models/PlacementRequest");

exports.getRewardPoints = async (req, res) => {
  const points = await RewardPoint.find({}).populate("studentId", "userId").lean();
  res.json(points);
};

exports.getLeaveRequests = async (req, res) => {
  const leaves = await LeaveRequest.find({}).lean();
  res.json(leaves);
};

// Legacy route — kept so nothing breaks, returns empty array for placements
// Students should now use GET /student/my-placements
exports.getPlacementRequests = async (req, res) => {
  res.json([]);
};
