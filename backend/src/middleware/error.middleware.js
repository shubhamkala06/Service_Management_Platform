const sendResponse = require("../utils/response.util");
const logger = require("../config/logger");

function errorHandler(error, req, res, next) {
  logger.error(err.stack || err.message);
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
