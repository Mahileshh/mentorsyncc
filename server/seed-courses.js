const mongoose = require("mongoose");
require("dotenv").config();
const Student = require("./models/Student");
const CourseExemption = require("./models/CourseExemption");

const DEPT_COURSES = {
  "COMPUTER SCIENCE AND BUSINESS SYSTEMS": [
    "Data Structures",
    "Operating Systems",
    "Database Management Systems",
    "Software Engineering",
    "Computer Networks",
    "Financial Management",
    "Business Communication"
  ],
  "DEFAULT": [
    "Engineering Mathematics",
    "Physics",
    "Basic Electrical Engineering",
    "Programming in C",
    "English"
  ]
};

async function seedDepartmentCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const students = await Student.find({});
    console.log(`Found ${students.length} students to process.`);

    // Clear all existing exemptions to ensure a clean slate since we're replacing the whole curriculum 
    await CourseExemption.deleteMany({});
    console.log("Cleared old course exemption requests to avoid orphaned data.");

    let updateCount = 0;
    
    for (let student of students) {
      const dept = student.department?.toUpperCase() || "DEFAULT";
      const coursesToAssign = DEPT_COURSES[dept] || DEPT_COURSES["DEFAULT"];

      student.enrolledCourses = coursesToAssign.map(c => ({
        name: c,
        status: "Enrolled"
      }));

      await student.save();
      updateCount++;
    }

    console.log(`Successfully assigned department-specific courses to ${updateCount} students.`);
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    process.exit(0);
  }
}

seedDepartmentCourses();
