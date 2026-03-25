require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const validateEnv = require("./middleware/validateEnv");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const studentRoutes = require("./routes/studentRoutes");
const publicRoutes = require("./routes/publicRoutes");

const app = express();

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();

    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/mentor", mentorRoutes);
    app.use("/api/student", studentRoutes);
    app.use("/api", publicRoutes);

    // Global Error Handler
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
