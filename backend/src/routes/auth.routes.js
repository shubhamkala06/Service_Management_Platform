const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

/**
 * Register System Administrator
 */
router.post("/register-admin", authController.registerAdmin);

module.exports = router;
