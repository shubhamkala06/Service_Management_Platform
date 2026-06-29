const authService = require("../services/auth.service");

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
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
}

module.exports = {
  registerAdmin,
};
