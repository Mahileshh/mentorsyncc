// d:\projects\MentorSync\server\migrate-to-atlas.js
require("dotenv").config();
const mongoose = require("mongoose");

// Import all models
const CourseExemption = require("./models/CourseExemption");
const LeaveRequest = require("./models/LeaveRequest");
const MentorStudent = require("./models/MentorStudent");
const PlacementRequest = require("./models/PlacementRequest");
const RewardPoints = require("./models/RewardPoints");
const Student = require("./models/Student");
const User = require("./models/User");

// --- Configuration ---
// Change your local URI here if it differs:
const LOCAL_URI = "mongodb://127.0.0.1:27017/mentor_management";

// ⚠️ IMPORTANT: Paste your Atlas connection string here!
// Replace <username>, <password>, and the cluster URL. Add your database name (e.g., /MentorSync_Atlas)
const ATLAS_URI = "mongodb+srv://mahilesh:2006@cluster0.r8q0fnw.mongodb.net/?appName=Cluster0";

async function migrate() {
  let localConn, atlasConn;
  try {
    if (ATLAS_URI.includes("<password>")) {
      console.error("❌ ERROR: Please replace <password> in ATLAS_URI with your real Atlas password before running.");
      process.exit(1);
    }

    console.log("🔌 Connecting to Local MongoDB...");
    localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log("✅ Custom Local Connection established");

    // Map models to the local connection
    const LocalCourseExemption = localConn.model("CourseExemption", CourseExemption.schema);
    const LocalLeaveRequest = localConn.model("LeaveRequest", LeaveRequest.schema);
    const LocalMentorStudent = localConn.model("MentorStudent", MentorStudent.schema);
    const LocalPlacementRequest = localConn.model("PlacementRequest", PlacementRequest.schema);
    const LocalRewardPoints = localConn.model("RewardPoints", RewardPoints.schema);
    const LocalStudent = localConn.model("Student", Student.schema);
    const LocalUser = localConn.model("User", User.schema);

    console.log("📥 Fetching local data...");
    const courseExemptions = await LocalCourseExemption.find().lean();
    const leaveRequests = await LocalLeaveRequest.find().lean();
    const mentorStudents = await LocalMentorStudent.find().lean();
    const placementRequests = await LocalPlacementRequest.find().lean();
    const rewardPoints = await LocalRewardPoints.find().lean();
    const students = await LocalStudent.find().lean();
    const users = await LocalUser.find().lean();

    console.log(`\n📊 Found Data:`);
    console.log(`  - ${users.length} Users`);
    console.log(`  - ${students.length} Students`);
    console.log(`  - ${mentorStudents.length} Mentor-Student Mappings`);
    console.log(`  - ${leaveRequests.length} Leave Requests`);
    console.log(`  - ${placementRequests.length} Placement Requests`);
    console.log(`  - ${courseExemptions.length} Course Exemptions`);
    console.log(`  - ${rewardPoints.length} Reward Points`);

    console.log("\n🔌 Connecting to MongoDB Atlas...");
    atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log("✅ Atlas Connection established");

    // Map models to the Atlas connection
    const AtlasCourseExemption = atlasConn.model("CourseExemption", CourseExemption.schema);
    const AtlasLeaveRequest = atlasConn.model("LeaveRequest", LeaveRequest.schema);
    const AtlasMentorStudent = atlasConn.model("MentorStudent", MentorStudent.schema);
    const AtlasPlacementRequest = atlasConn.model("PlacementRequest", PlacementRequest.schema);
    const AtlasRewardPoints = atlasConn.model("RewardPoints", RewardPoints.schema);
    const AtlasStudent = atlasConn.model("Student", Student.schema);
    const AtlasUser = atlasConn.model("User", User.schema);

    console.log("🧹 Clearing existing Atlas data (if any)...");
    await AtlasCourseExemption.deleteMany({});
    await AtlasLeaveRequest.deleteMany({});
    await AtlasMentorStudent.deleteMany({});
    await AtlasPlacementRequest.deleteMany({});
    await AtlasRewardPoints.deleteMany({});
    await AtlasStudent.deleteMany({});
    await AtlasUser.deleteMany({});

    console.log("📤 Inserting data into Atlas...");
    if (users.length) await AtlasUser.insertMany(users);
    if (students.length) await AtlasStudent.insertMany(students);
    if (mentorStudents.length) await AtlasMentorStudent.insertMany(mentorStudents);
    if (leaveRequests.length) await AtlasLeaveRequest.insertMany(leaveRequests);
    if (placementRequests.length) await AtlasPlacementRequest.insertMany(placementRequests);
    if (courseExemptions.length) await AtlasCourseExemption.insertMany(courseExemptions);
    if (rewardPoints.length) await AtlasRewardPoints.insertMany(rewardPoints);

    console.log("\n🎉 Migration to Atlas Complete!");
  } catch (err) {
    console.error("\n❌ Migration failed:", err);
  } finally {
    if (localConn) await localConn.close();
    if (atlasConn) await atlasConn.close();
    process.exit(0);
  }
}

migrate();
