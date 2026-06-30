const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");

const { registerAdminSchema } = require("../validations/auth.validation");

/**
 * Register System Administrator
 */
router.post("/register-admin",validate(registerAdminSchema), authController.registerAdmin);

module.exports = router;
