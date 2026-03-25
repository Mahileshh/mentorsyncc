const Leave = require("../models/LeaveRequest");
const Placement = require("../models/PlacementRequest");
const Student = require("../models/Student");
const Exemption = require("../models/CourseExemption");
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

// --- Course Exemptions ---

exports.applyExemption = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectName, reason, certificationLink, creditCount } = req.body;

    if (!subjectName || !reason || creditCount === undefined) {
      return res.status(400).json({ message: "Subject name, reason, and credit count are required." });
    }

    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    const courseIndex = student.enrolledCourses.findIndex(c => c.name === subjectName);
    if (courseIndex === -1) {
      return res.status(400).json({ message: "You are not enrolled in this course." });
    }
    
    // Check if it's already pending or exempted
    if (student.enrolledCourses[courseIndex].status !== 'Enrolled') {
      return res.status(400).json({ message: `Course is already ${student.enrolledCourses[courseIndex].status}.` });
    }

    // Set status to pending
    student.enrolledCourses[courseIndex].status = "Pending";
    await student.save();

    const exemption = await Exemption.create({
      studentId: student._id,
      subjectName,
      reason,
      certificationLink,
      creditCount,
    });

    res.status(201).json(exemption);
  } catch (err) {
    console.error("applyExemption error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyExemptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ userId });
    if (!student) return res.status(404).json({ message: "Student record not found" });


    const exemptions = await Exemption.find({ studentId: student._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(exemptions);
  } catch (err) {
    console.error("getMyExemptions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get the logged-in student's own reward history
exports.getMyRewards = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }
    const rewards = await require("../models/RewardPoints")
      .find({ studentId: student._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(rewards);
  } catch (err) {
    console.error("getMyRewards error:", err);
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

// Fixed max leave for all students; quota proportional to attendance
// 75% attendance is the minimum threshold — everyone gets the same base max
const MAX_LEAVES = 15;

function computeLeaveQuota(attendance) {
  // If attendance is >= 75%, they get the full 15 days.
  // If attendance is < 75%, their quota scales down proportionally
  if (attendance >= 75) return MAX_LEAVES;
  return Math.floor(MAX_LEAVES * (attendance / 75));
}

// Get the logged-in student's own leave records
exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    const leaves = await Leave.find({ studentId: student._id })
      .sort({ createdAt: -1 })
      .lean();

    // Normalize status to lowercase so the frontend filters work correctly
    const normalized = leaves.map((l) => ({
      ...l,
      status: l.status.toLowerCase(),
    }));

    res.json(normalized);
  } catch (err) {
    console.error("getMyLeaves error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ userId }).select("-__v");
    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    const attendance = student.attendance ?? 75;

    res.json({
      ...student.toObject(),
      maxLeaves: MAX_LEAVES,                                   // fixed for all students
      attendanceBasedLeaveQuota: computeLeaveQuota(attendance), // scales with attendance
    });
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
