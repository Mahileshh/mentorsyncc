const mongoose = require("mongoose");
const User = require("./models/User");
const mentorController = require("./controllers/mentorController");
require("dotenv").config();

async function testController() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const mentor = await User.findOne({ role: "mentor" });
    if (!mentor) {
      console.log("No mentor found!");
      process.exit(1);
    }
    console.log("Found Mentor:", mentor._id, mentor.email);

    const req = { user: { id: mentor._id } };
    const res = {
      json: (data) => console.log("SUCCESS RESPONSE:", JSON.stringify(data, null, 2)),
      status: (code) => ({
        json: (data) => console.log(`ERROR ${code}:`, data)
      })
    };

    console.log("Calling getMyExemptions...");
    await mentorController.getMyExemptions(req, res);

  } catch (err) {
    console.error("Test Script Error:", err);
  } finally {
    process.exit(0);
  }
}
testController();
