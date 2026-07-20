const express = require("express");
const ticketController = require("./controller");
const {
  validateCreateTicket,
  validateAddComment,
  validateAssignTicket,
  validateUpdateStatus,
} = require("./validation.js");
const { authenticate, authorize } = require("../middleware/index.js");
const router = express.Router();
const upload = require("../middleware/upload.middleware.js");

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

//not that much use (optional)
router.patch(
  "/:ticketId/reassign",
  authenticate,
  authorize("ADMIN"),
  validateAssignTicket,
  ticketController.reassignTicket,
);

router.patch(
  "/:ticketId/status",
  authenticate,
  authorize("ADMIN", "SUPPORT_ENGINEER"),
  validateUpdateStatus,
  ticketController.updateTicketStatus,
);

module.exports = router;
