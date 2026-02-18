const Student = require("../models/Student");
const MentorStudent = require("../models/MentorStudent");
const RewardPoint = require("../models/RewardPoint");
const Placement = require("../models/PlacementRequest");

// Add student profile
exports.addStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
};

// Assign student to mentor
exports.assignStudent = async (req, res) => {
  const { mentorId, studentId } = req.body;
  const mapping = await MentorStudent.create({ mentorId, studentId });
  res.json(mapping);
};

// Add Reward Points
exports.addRewardPoints = async (req, res) => {
  const { studentId, activity, points } = req.body;

  await RewardPoint.create({
    studentId,
    activity,
    points,
    addedBy: req.user.id,
  });

  await Student.findByIdAndUpdate(studentId, {
    $inc: { rewardPointsTotal: points },
  });

  res.json({ message: "Points Added" });
};

// Final Placement Verification
exports.finalVerifyPlacement = async (req, res) => {
  const { placementId } = req.body;

  await Placement.findByIdAndUpdate(placementId, {
    status: "Officially Placed",
  });

  res.json({ message: "Placement Officially Verified" });
};
