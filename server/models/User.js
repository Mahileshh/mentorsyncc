
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // already hashed
  role: {
    type: String,
    enum: ["admin", "mentor", "student"],
  },
});

module.exports = mongoose.model("User", userSchema);
