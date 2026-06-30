const authService = require("../services/auth.service");
const sendResponse = require("../utils/response.util");
const asyncHandler = require("../utils/async-handler");

/**
 * Register System Administrator
 */
const registerAdmin = asyncHandler(async (req, res) => {
  const result = await authService.registerAdmin(req.body);

  return sendResponse(
    res,
    201,
    true,
    "Administrator registered successfully.",
    result,
  );
});

/**
 * Login User
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  return sendResponse(res, 200, true, "Login successful.", result);
});

module.exports = {
  registerAdmin,
  login,
};
