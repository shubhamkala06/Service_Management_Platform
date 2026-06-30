const authService = require("../services/auth.service");
const sendResponse = require("../utils/response.util");

/**
 * Register System Administrator
 */
async function registerAdmin(req, res) {
  try {
    const result = await authService.registerAdmin(req.body);

    return res.status(201).json({
      success: true,

      message: "Administrator registered successfully.",

      data: result,
    });
  } catch (error) {
    sendResponse(
      res,
      201,
      true,
      "Administrator registered successfully.",
      result,
    );
  }
}
/**
 * Login User
 */
async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    sendResponse(res, 200, true, "Login successful.", result);
  }
}

module.exports = {
  registerAdmin,
  login,
};
