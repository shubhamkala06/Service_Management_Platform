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

router.get(
  "/my",
  authenticate,
  authorize("EMPLOYEE"),
  ticketController.getMyTickets,
);
router.get("/:ticketId", authenticate, ticketController.getTicketById);

router.post(
  "/:ticketId/comments",
  authenticate,
  validateAddComment,
  ticketController.addComment,
);

router.post(
  "/comments/:commentId/attachments",
  authenticate,
  upload.single("file"),
  ticketController.uploadAttachment,
);

module.exports = router;
