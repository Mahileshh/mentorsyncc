const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.login = asyncHandler(async (req, res) => {
  console.log("[authController] login body:", req.body);

  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError("Invalid credentials", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError("Invalid credentials", 400);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    success: true,
    data: {
      token,
      role: user.role,
      name: user.name,
      email: user.email,
    },
  });
});
