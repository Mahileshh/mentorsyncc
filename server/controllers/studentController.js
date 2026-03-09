const Leave = require("../models/LeaveRequest");
const Placement = require("../models/PlacementRequest");
const Student = require("../models/Student");

// Apply Leave
exports.applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    const leave = await Leave.create({
      ...req.body,
      studentId: student._id,
      status: "Pending" // Force Pending status on creation
    });

    res.json(leave);
  } catch (err) {
    console.error("applyLeave error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit Placement
exports.submitPlacement = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    // Explicitly pick only allowed fields — never trust req.body for status/studentId
    const { company, role, package: pkg, offerLetterUrl, remarks } = req.body;

    if (!company || !role || !pkg) {
      return res.status(400).json({ message: "company, role, and package are required" });
    }

    const placement = await Placement.create({
      studentId: student._id,
      company: company.trim(),
      role: role.trim(),
      package: pkg.trim(),
      offerLetterUrl: offerLetterUrl?.trim() || "",
      remarks: remarks?.trim() || "",
      status: "Pending Mentor", // Always start as pending — mentor must approve
    });

    res.json(placement);
  } catch (err) {
    console.error("submitPlacement error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get the logged-in student's own placement records
exports.getMyPlacements = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    const placements = await Placement.find({ studentId: student._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(placements);
  } catch (err) {
    console.error("getMyPlacements error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Leave quota based on attendance tier
function computeLeaveQuota(attendance, totalLeaves) {
  if (attendance >= 90) return totalLeaves;           // 100%
  if (attendance >= 75) return Math.floor(totalLeaves * 0.8); // 80%
  if (attendance >= 60) return Math.floor(totalLeaves * 0.5); // 50%
  return Math.floor(totalLeaves * 0.25);              // 25%
}

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ userId }).select("-__v");
    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    const attendance  = student.attendance  ?? 75;
    const totalLeaves = student.totalLeaves ?? 15;

    res.json({
      ...student.toObject(),
      attendanceBasedLeaveQuota: computeLeaveQuota(attendance, totalLeaves),
    });
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
