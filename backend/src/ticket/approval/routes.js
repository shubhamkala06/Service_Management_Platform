const express = require("express");
const router = express.Router();

const approvalController = require("./controller");
const { authenticate, authorize } = require("../../middleware");
const validate = require("../../middleware/validate.middleware");
const { validateApprovalDecision } = require("./validation");

/* ===========================================================
   SUPPORT ENGINEER
=========================================================== */

router.post(
  "/:ticketId",
  authenticate,
  authorize("Support Engineer"),
  approvalController.sendForApproval,
);

/* ===========================================================
   MANAGER
=========================================================== */

router.get(
  "/pending",
  authenticate,
  authorize("Manager"),
  approvalController.getPendingApprovals,
);

router.patch(
  "/:approvalId/approve",
  authenticate,
  authorize("Manager"),
  validateApprovalDecision,
  validate,
  approvalController.approveRequest,
);

router.patch(
  "/:approvalId/reject",
  authenticate,
  authorize("Manager"),
  validateApprovalDecision,
  validate,
  approvalController.rejectRequest,
);

module.exports = router;
