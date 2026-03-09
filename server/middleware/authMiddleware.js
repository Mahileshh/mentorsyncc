const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Accept both 'Authorization' and lowercase 'authorization' headers
  let authHeader = req.header("Authorization") || req.header("authorization");

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  // Support 'Bearer <token>' or raw token
  const parts = authHeader.split(" ");
  const token = parts.length === 2 && parts[0].toLowerCase() === "bearer" ? parts[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id & role
    next();
  } catch (err) {
    console.error("authMiddleware verify error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
