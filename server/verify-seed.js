require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");
const User = require("./models/User");
const MentorStudent = require("./models/MentorStudent");

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const studentCount = await Student.countDocuments();
        const studentUserCount = await User.countDocuments({ role: "student" });
        const mentorUserCount = await User.countDocuments({ role: "mentor" });
        const assignmentCount = await MentorStudent.countDocuments();

        console.log(`Total Students: ${studentCount}`);
        console.log(`Total Student Users: ${studentUserCount}`);
        console.log(`Total Mentor Users: ${mentorUserCount}`);
        console.log(`Total Assignments: ${assignmentCount}`);

        const sampleAssignment = await MentorStudent.findOne()
            .populate("mentorId", "name email")
            .populate("studentId", "name batch");

        console.log("Sample Assignment:", JSON.stringify(sampleAssignment, null, 2));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
