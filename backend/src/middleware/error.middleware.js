const sendResponse = require("../utils/response.util");

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  return sendResponse(res, statusCode, false, message);
}

module.exports = errorHandler;
