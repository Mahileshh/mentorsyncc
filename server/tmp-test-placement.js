const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Student = require("./models/Student");
const Placement = require("./models/PlacementRequest");

(async () => {
  await connectDB();
  const student = await Student.findOne().lean();
  console.log("sample student id", student?._id);

  const placement = await Placement.create({
    studentId: student._id,
    company: "TestCo",
    role: "Tester",
    package: "1",
    offerLetterUrl: "",
    remarks: "",
  });

  console.log("created status", placement.status);

  const fetched = await Placement.findById(placement._id).lean();
  console.log("fetched status", fetched.status);

  await mongoose.disconnect();
})();
