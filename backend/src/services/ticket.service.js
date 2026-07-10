const repository = require("../repositories/ticket.repository");
const { calculateDeadline } = require("../utils/sla.util");
const { generateTicketNumber } = require("../utils/ticket-number.util");
const logger = require("../config/logger");
const AppError = require("../errors/app-error.js");
const { get } = require("../app.js");

const TicketStatus = {
  OPEN: "OPEN",
};

async function createTicket(payload, userId) {
  const { title, description, priority, categoryId } = payload;

  // Category Validation
  const category = await repository.findCategoryById(categoryId);
  if (!category) {
    throw new AppError(404, "Support category not found.");
  }

  const slaPolicy = category.slaPolicies || null;

  const lastTicket = await repository.getLastTicket();
  const ticketNumber = generateTicketNumber(lastTicket?.id || 0);

  const deadline = calculateDeadline(slaPolicy?.resolutionTarget);

  // Ticket Data
  const ticketData = {
    ticketNumber,
    title,
    description,
    priority,
    status: TicketStatus.OPEN,
    deadline,
    createdById: userId,
    categoryId,
    slaPolicyId: slaPolicy?.id || null,
  };

  // Status History
  const historyData = {
    oldStatus: TicketStatus.OPEN,
    newStatus: TicketStatus.OPEN,
    remarks: "Ticket Created",
    changedById: userId,
  };

  return repository.createTicketWithHistory(ticketData, historyData);
}

async function getMyTickets(userId, filters) {
  const tickets = await repository.getTicketsByUserId(userId, filters);
  return tickets;
}

async function getTicketById(ticketId, loggedInUser) {
  const ticket = await repository.getTicketById(ticketId);
  if (!ticket) {
    throw new AppError(404, "Ticket not found.");
  }

  if (
    loggedInUser.role === "EMPLOYEE" &&
    ticket.createdById !== loggedInUser.id
  ) {
    throw new AppError(403, "You are not authorized to access this ticket.");
  }

  return ticket;
}

async function addComment(ticketId, content, loggedInUser) {
  const ticket = await repository.findTicketById(ticketId);
  if (!ticket) {
    throw new AppError(404, "Ticket not found.");
  }
  if (ticket.status === "CLOSED") {
    throw new AppError(400, "Cannot comment on a closed ticket.");
  }

  if (
    loggedInUser.role === "EMPLOYEE" &&
    ticket.createdById !== loggedInUser.id
  ) {
    throw new AppError(
      403,
      "You are not authorized to comment on this ticket.",
    );
  }

  const comment = await repository.createComment({
    content,
    ticketId: Number(ticketId),
    userId: loggedInUser.id,
  });

  logger.info(
    `Comment added on Ticket ${ticket.ticketNumber} by User ${loggedInUser.id}`,
  );

  return comment;
}

async function uploadAttachment(commentId, file, loggedInUser) {
  const attachment = await repository.createAttachment({
    fileName: file.filename,
    filePath: `/uploads/tickets/${file.filename}`,
    fileType: file.mimetype,
    fileSize: file.size,
    uploadedById: loggedInUser.id,
    commentId: Number(commentId),
  });
  logger.info(`Attachment uploaded by User ${loggedInUser.id}`);
  return attachment;
}

async function assignTicket(ticketId, assignedToId, loggedInUser) {
  // 1. Find Ticket
  const ticket = await repository.findTicketById(ticketId);
  if (!ticket) {
    throw new AppError(404, "Ticket not found.");
  }
  // 2. Closed Ticket Check
  if (ticket.status === "CLOSED") {
    throw new AppError(400, "Closed ticket cannot be assigned.");
  }
  // 3. Find Engineer
  const engineer = await repository.findUserById(assignedToId);
  if (!engineer) {
    throw new AppError(404, "Support engineer not found.");
  }
  // 4. Active Check
  if (!engineer.isActive) {
    throw new AppError(400, "Support engineer is inactive.");
  }
  // 5. Role Check
  if (engineer.role.name !== "SUPPORT_ENGINEER") {
    throw new AppError(
      400,
      "Ticket can only be assigned to a Support Engineer.",
    );
  }
  // 6. Already Assigned?
  if (ticket.assignedToId === engineer.id) {
    throw new AppError(400, "Ticket is already assigned to this engineer.");
  }
  // 7. Assign Ticket
  const updatedTicket = await repository.assignTicketWithHistory(
    ticket.id,
    engineer.id,
    loggedInUser.id,
  );

  logger.info(
    `Ticket ${ticket.ticketNumber} assigned to ${engineer.firstName} ${engineer.lastName} by Admin ${loggedInUser.id}`,
  );

  return updatedTicket;
}

module.exports = {
  createTicket,
  createTicket,
  getMyTickets,
  getTicketById,
  addComment,
  uploadAttachment,
  assignTicket,
};
