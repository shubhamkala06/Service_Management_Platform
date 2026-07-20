const sendResponse = require("../../core/utils/response");
const approvalService = require("./service");

/* ===========================================================
   SEND FOR APPROVAL
=========================================================== */

async function sendForApproval(req, res, next) {
  try {
    const approval = await approvalService.sendForApproval(
      req.params.ticketId,
      req.user,
    );

    return sendResponse(
      res,
      201,
      "Approval request sent successfully.",
      approval,
    );
  } catch (error) {
    next(error);
  }
}

/* ===========================================================
   PENDING APPROVALS
=========================================================== */

async function getPendingApprovals(req, res, next) {
  try {
    const approvals = await approvalService.getPendingApprovals(req.user.id);

    return sendResponse(
      res,
      200,
      "Pending approvals fetched successfully.",
      approvals,
    );
  } catch (error) {
    next(error);
  }
}

/* ===========================================================
   APPROVE
=========================================================== */

async function approveRequest(req, res, next) {
  try {
    const approval = await approvalService.approveRequest(
      req.params.approvalId,
      req.body.remarks,
      req.user,
    );

    return sendResponse(res, 200, "Request approved successfully.", approval);
  } catch (error) {
    next(error);
  }
}

/* ===========================================================
   REJECT
=========================================================== */

async function rejectRequest(req, res, next) {
  try {
    const approval = await approvalService.rejectRequest(
      req.params.approvalId,
      req.body.remarks,
      req.user,
    );

    return sendResponse(res, 200, "Request rejected successfully.", approval);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendForApproval,
  getPendingApprovals,
  approveRequest,
  rejectRequest,
};
