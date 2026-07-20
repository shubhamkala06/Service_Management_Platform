const repository = require("./repository");

const AppError = require("../../errors/AppError");
const logger = require("../../logger");

const ApprovalDecision = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

/* ===========================================================
   SEND FOR APPROVAL
=========================================================== */
async function sendForApproval(ticketId, loggedInUser) {
  const ticket = await repository.findTicketWithCreator(ticketId);

  if (!ticket) {
    throw new AppError(404, "Ticket not found.");
  }
  if (ticket.purpose !== "REQUEST") {
    throw new AppError(400, "Only request tickets require approval.");
  }
  if (!ticket.assignedToId) {
    throw new AppError(400, "Ticket is not assigned to any engineer.");
  }
  if (ticket.assignedToId !== loggedInUser.id) {
    throw new AppError(
      403,
      "Only assigned engineer can send ticket for approval.",
    );
  }

  const existingApproval = await repository.findApprovalByTicket(ticketId);

  if (existingApproval) {
    throw new AppError(400, "Approval request already exists.");
  }
  const manager = await repository.findManagerByDepartment(
    ticket.createdBy.department,
  );
  if (!manager) {
    throw new AppError(
      404,
      `No manager found for department ${ticket.createdBy.department}.`,
    );
  }

  const approval = await repository.createApproval({
    approverId: manager.id,
    ticketId: ticket.id,
    decision: ApprovalDecision.PENDING,
  });

  logger.info(
    `Approval request created for Ticket ${ticket.ticketNumber} by Engineer ${loggedInUser.id}. Manager: ${manager.id}`,
  );

  return approval;
}

/* ===========================================================
   PENDING APPROVALS
=========================================================== */

async function getPendingApprovals(managerId) {
  return repository.getPendingApprovals(managerId);
}

/* ===========================================================
   APPROVE REQUEST
=========================================================== */

async function approveRequest(approvalId, remarks, loggedInUser) {
  const approval = await repository.findApprovalById(approvalId);

  if (!approval) {
    throw new AppError(404, "Approval not found.");
  }
  if (approval.approverId !== loggedInUser.id) {
    throw new AppError(403, "You are not authorized to approve this request.");
  }
  if (approval.decision !== ApprovalDecision.PENDING) {
    throw new AppError(400, "Approval request has already been processed.");
  }

  const updatedApproval = await repository.approveApprovalWithHistory(
    approvalId,
    remarks,
    loggedInUser.id,
  );
  logger.info(`Approval ${approvalId} approved by Manager ${loggedInUser.id}`);

  return updatedApproval;
}

/* ===========================================================
   REJECT REQUEST
=========================================================== */

async function rejectRequest(approvalId, remarks, loggedInUser) {
  const approval = await repository.findApprovalById(approvalId);

  if (!approval) {
    throw new AppError(404, "Approval not found.");
  }
  if (approval.approverId !== loggedInUser.id) {
    throw new AppError(403, "You are not authorized to reject this request.");
  }
  if (approval.decision !== ApprovalDecision.PENDING) {
    throw new AppError(400, "Approval request has already been processed.");
  }

  const updatedApproval = await repository.rejectApprovalWithHistory(
    approvalId,
    remarks,
    loggedInUser.id,
  );

  logger.info(`Approval ${approvalId} rejected by Manager ${loggedInUser.id}`);
  return updatedApproval;
}

module.exports = {
  sendForApproval,
  getPendingApprovals,
  approveRequest,
  rejectRequest,
};
