const express = require("express");

const ticketController = require("../controllers/ticket.controller");
const { validateCreateTicket } = require("../validations/ticket.validation");

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const router = express.Router();

/*
 * Only Employee can create ticket
 */

router.post(
  "/",
  authenticate,
  authorize("EMPLOYEE"),
  validateCreateTicket,
  ticketController.createTicket,
);

module.exports = router;
