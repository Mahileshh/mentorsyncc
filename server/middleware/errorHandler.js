const ApiError = require("../utils/ApiError");

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  console.error("[errorHandler]", err);

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
