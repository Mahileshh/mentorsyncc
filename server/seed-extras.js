require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const User = require("./models/User");
const Student = require("./models/Student");
const MentorStudent = require("./models/MentorStudent");
const LeaveRequest = require("./models/LeaveRequest");
const PlacementRequest = require("./models/PlacementRequest");
const RewardPoint = require("./models/RewardPoints");

async function seedExtras() {
  await connectDB();

  // Build lookup maps for users and students by email
  const users = await User.find({}).lean();
  const usersByEmail = new Map(users.map((u) => [u.email, u]));

  const students = await Student.find({}).populate("userId", "email").lean();
  const studentsByEmail = new Map(students.map((s) => [s.userId.email, s]));

  // 1) MentorStudent mappings
  const pairs = [
    ["chandru.k@mentor.com", "dharneshk7376232cb109@student.com"],
    // add more pairs here if desired
  ];

  let createdMentorStudent = 0;
  for (const [mentorEmail, studentEmail] of pairs) {
    const mentor = usersByEmail.get(mentorEmail);
    const student = studentsByEmail.get(studentEmail);
    if (!mentor || !student) {
      console.log(`Skipping mapping — missing user/student: ${mentorEmail}, ${studentEmail}`);
      continue;
    }

    const exists = await MentorStudent.findOne({ mentorId: mentor._id, studentId: student._id });
    if (!exists) {
      await MentorStudent.create({ mentorId: mentor._id, studentId: student._id });
      createdMentorStudent++;
    }
  }

  // 2) RewardPoints
  const rewardSamples = [
    { studentEmail: "dharneshk7376232cb109@student.com", activity: "Project Demo", points: 50, addedByEmail: "chandru.k@mentor.com" },
    { studentEmail: "dharneshk7376232cb109@student.com", activity: "Participation", points: 10, addedByEmail: "chandru.k@mentor.com" },
  ];

  let createdRewards = 0;
  for (const r of rewardSamples) {
    const student = studentsByEmail.get(r.studentEmail);
    const addedBy = usersByEmail.get(r.addedByEmail);
    if (!student || !addedBy) {
      console.log(`Skipping reward — missing: ${r.studentEmail} or ${r.addedByEmail}`);
      continue;
    }

    // Idempotency: check by studentId + activity + points
    const exists = await RewardPoint.findOne({ studentId: student._id, activity: r.activity, points: r.points });
    if (!exists) {
      await RewardPoint.create({ studentId: student._id, activity: r.activity, points: r.points, addedBy: addedBy._id });
      await Student.updateOne({ _id: student._id }, { $inc: { rewardPointsTotal: r.points } });
      createdRewards++;
    }
  }

  // 3) LeaveRequests
  const leaveSamples = [
    { studentEmail: "dharneshk7376232cb109@student.com", from: new Date(), to: new Date(Date.now() + 3 * 24 * 3600 * 1000), reason: "Medical", status: "Pending" },
    { studentEmail: "dharneshk7376232cb109@student.com", from: new Date(Date.now() - 7 * 24 * 3600 * 1000), to: new Date(Date.now() - 5 * 24 * 3600 * 1000), reason: "Personal", status: "Approved" },
  ];

  let createdLeaves = 0;
  for (const l of leaveSamples) {
    const student = studentsByEmail.get(l.studentEmail);
    if (!student) continue;
    const exists = await LeaveRequest.findOne({ studentId: student._id, fromDate: l.from, toDate: l.to, reason: l.reason });
    if (!exists) {
      await LeaveRequest.create({ studentId: student._id, fromDate: l.from, toDate: l.to, reason: l.reason, status: l.status });
      createdLeaves++;
    }
  }

  // 4) PlacementRequests
  const placementSamples = [
    { studentEmail: "dharneshk7376232cb109@student.com", company: "Acme Corp", role: "Software Intern", package: "6 LPA", status: "Mentor Verified" },
    { studentEmail: "dharneshk7376232cb109@student.com", company: "Globex", role: "SDE", package: "10 LPA", status: "Officially Placed" },
  ];

  let createdPlacements = 0;
  for (const p of placementSamples) {
    const student = studentsByEmail.get(p.studentEmail);
    if (!student) continue;
    const exists = await PlacementRequest.findOne({ studentId: student._id, company: p.company, role: p.role });
    if (!exists) {
      await PlacementRequest.create({ studentId: student._id, company: p.company, role: p.role, package: p.package, status: p.status });
      createdPlacements++;
    }
  }

  console.log(`Created MentorStudent: ${createdMentorStudent}`);
  console.log(`Created RewardPoint: ${createdRewards}`);
  console.log(`Created LeaveRequest: ${createdLeaves}`);
  console.log(`Created PlacementRequest: ${createdPlacements}`);

  mongoose.disconnect();
}

seedExtras().catch((err) => {
  console.error("seed-extras failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
