const Leave = require("../models/LeaveRequest");
const Placement = require("../models/PlacementRequest");
const MentorStudent = require("../models/MentorStudent");
const Student = require("../models/Student");
const User = require("../models/User");
const RewardPoint = require("../models/RewardPoints");

// Approve Leave
exports.approveLeave = async (req, res) => {
  try {
    const { leaveId, status } = req.body;
    // Normalize status to match enum (Pending, Approved, Rejected)
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    await Leave.findByIdAndUpdate(leaveId, { status: normalizedStatus });
    res.json({ message: `Leave ${normalizedStatus}` });
  } catch (err) {
    console.error("approveLeave error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get leaves for students assigned to the logged-in mentor
exports.getMyLeaves = async (req, res) => {
  try {
    const mentorId = req.user.id;

    // 1. Find all student IDs assigned to this mentor
    const assignedStudents = await MentorStudent.find({ mentorId }).select("studentId");
    const studentIds = assignedStudents.map(m => m.studentId);

    // 2. Fetch all leave requests for these students
    const leaves = await Leave.find({ studentId: { $in: studentIds } })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "name" }
      })
      .sort({ fromDate: -1 });

    // 3. Flatten the data for the frontend
    const formattedLeaves = leaves.map(l => ({
      _id: l._id,
      studentName: l.studentId?.userId?.name || "Unknown Student",
      reason: l.reason,
      fromDate: l.fromDate,
      toDate: l.toDate,
      status: l.status.toLowerCase() // Send lowercase to match frontend logic
    }));

    res.json(formattedLeaves);
  } catch (err) {
    console.error("getMyLeaves error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify Placement (First Level) — kept for backward compat
exports.verifyPlacement = async (req, res) => {
  const { placementId } = req.body;
  await Placement.findByIdAndUpdate(placementId, { status: "Mentor Verified" });
  res.json({ message: "Placement Verified by Mentor" });
};

// Get all placements for students assigned to this mentor
exports.getMyPlacements = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const assignedStudents = await MentorStudent.find({ mentorId }).select("studentId");
    const studentIds = assignedStudents.map((m) => m.studentId);

    const placements = await Placement.find({ studentId: { $in: studentIds } })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "name email" },
      })
      .sort({ createdAt: -1 });

    const formatted = placements.map((p) => ({
      _id: p._id,
      studentName: p.studentId?.userId?.name || "Unknown",
      studentEmail: p.studentId?.userId?.email || "",
      company: p.company,
      role: p.role,
      package: p.package,
      offerLetterUrl: p.offerLetterUrl || "",
      remarks: p.remarks || "",
      status: p.status,
      rejectionReason: p.rejectionReason || "",
      createdAt: p.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getMyPlacements error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve or Reject a placement — with ownership + status guard
exports.updatePlacement = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    // 1. Validate requested status
    const allowed = ["Mentor Verified", "Rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    // 2. Fetch the placement record
    const placement = await Placement.findById(id);
    if (!placement) {
      return res.status(404).json({ message: "Placement record not found." });
    }

    // 3. Gate: only act on placements that are still pending
    if (placement.status !== "Pending Mentor") {
      return res.status(409).json({
        message: `Placement is already '${placement.status}' and cannot be updated again.`,
      });
    }

    // 4. Ownership check: verify this student is actually assigned to this mentor
    const isAssigned = await MentorStudent.findOne({
      mentorId,
      studentId: placement.studentId,
    });
    if (!isAssigned) {
      return res.status(403).json({
        message: "You are not authorized to update this student's placement.",
      });
    }

    // 5. If rejecting, a reason must be provided
    if (status === "Rejected" && !rejectionReason?.trim()) {
      return res.status(400).json({ message: "A rejection reason is required." });
    }

    // 6. Apply the update
    await Placement.findByIdAndUpdate(id, {
      status,
      rejectionReason: status === "Rejected" ? rejectionReason.trim() : "",
    });

    res.json({ message: `Placement ${status}` });
  } catch (err) {
    console.error("updatePlacement error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get students assigned to the logged-in mentor
exports.getMyStudents = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const mappings = await MentorStudent.find({ mentorId }).populate({
      path: "studentId",
      populate: { path: "userId", select: "name email" },
    });

    const students = mappings.map((m) => {
      const s = m.studentId;
      return {
        _id: s._id,
        name: s.userId?.name || "",
        email: s.userId?.email || "",
        year: s.batch || "",
        department: s.department || "",
        attendance: s.attendance ?? 75,
        cgpa: s.cgpa ?? null,
      };
    });

    res.json(students);
  } catch (err) {
    console.error("getMyStudents error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get student rewards
exports.getStudentRewards = async (req, res) => {
  try {
    const { studentId } = req.params;
    const rewards = await RewardPoint.find({ studentId }).sort({ date: -1 });
    res.json(rewards);
  } catch (err) {
    console.error("getStudentRewards error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get student leaves
exports.getStudentLeaves = async (req, res) => {
  try {
    const { studentId } = req.params;
    const leaves = await Leave.find({ studentId }).sort({ fromDate: -1 });
    res.json(leaves);
  } catch (err) {
    console.error("getStudentLeaves error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get student academics
exports.getStudentAcademics = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).select("cgpa attendance backlogs marks totalLeaves");
    if (!student) return res.status(404).json({ message: "Student not found" });

    const attendance  = student.attendance  ?? 75;
    const totalLeaves = student.totalLeaves ?? 15;

    // Same tier formula as studentController
    let quota;
    if      (attendance >= 90) quota = totalLeaves;
    else if (attendance >= 75) quota = Math.floor(totalLeaves * 0.8);
    else if (attendance >= 60) quota = Math.floor(totalLeaves * 0.5);
    else                       quota = Math.floor(totalLeaves * 0.25);

    res.json({ ...student.toObject(), attendanceBasedLeaveQuota: quota });
  } catch (err) {
    console.error("getStudentAcademics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get student placements
exports.getStudentPlacements = async (req, res) => {
  try {
    const { studentId } = req.params;
    const placements = await Placement.find({ studentId }).sort({ createdAt: -1 });
    res.json(placements);
  } catch (err) {
    console.error("getStudentPlacements error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
