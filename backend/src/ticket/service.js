const repository = require("./repository.js");
const { calculateDeadline } = require("../core/utils/sla.js");
const { generateTicketNumber } = require("../core/utils/ticket-number.js");
const { logger } = require("../logger/index.js");
const { AppError } = require("../errors/index.js");

const TicketStatus = {
  OPEN: "OPEN",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  PENDING_USER_RESPONSE: "PENDING_USER_RESPONSE",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
};

const allowedTransitions = {
  OPEN: ["ASSIGNED"],
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["PENDING_USER_RESPONSE", "RESOLVED"],
  PENDING_USER_RESPONSE: ["IN_PROGRESS"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
};

async function createTicket(payload, userId) {
  const { title, description, purpose, priority, categoryId } = payload;

  const category = await repository.findCategoryById(categoryId);
  if (!category) {
    throw new AppError(404, "Support category not found.");
  }

  const slaPolicy = category.slaPolicy;

  const engineer = await repository.findLeastLoadedEngineer(
    category.supportTeamId,
  );

  const lastTicket = await repository.getLastTicket();
  const ticketNumber = generateTicketNumber(lastTicket?.id || 0);

  const deadline = calculateDeadline(slaPolicy?.resolutionTarget);
  const status = engineer ? TicketStatus.ASSIGNED : TicketStatus.OPEN;

  const ticketData = {
    ticketNumber,
    title,
    description,
    purpose,
    priority,
    status,
    deadline,
    createdById: userId,
    assignedToId: engineer?.id ?? null,
    categoryId,
    slaPolicyId: slaPolicy?.id ?? null,
  };

  const historyData = {
    oldStatus: TicketStatus.OPEN,
    newStatus: status,
    remarks: engineer
      ? "Ticket automatically assigned."
      : "Waiting for engineer assignment.",
    changedById: userId,
  };

  const ticket = await repository.createTicketWithHistory(
    ticketData,
    historyData,
  );

  logger.info(`Ticket ${ticket.ticketNumber} created by User ${userId}`);

  if (engineer) {
    logger.info(
      `Ticket ${ticket.ticketNumber} automatically assigned to ${engineer.firstName} ${engineer.lastName}`,
    );
  } else {
    logger.warn(
      `No active engineer found for Team ${category.supportTeam.name}. Ticket kept OPEN.`,
    );
  }

  return ticket;
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

async function reassignTicket(ticketId, assignedToId, loggedInUser) {
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
    `Ticket ${ticket.ticketNumber} Reassigned to ${engineer.firstName} ${engineer.lastName} by Admin ${loggedInUser.id}`,
  );

  return updatedTicket;
}

async function updateTicketStatus(ticketId, payload, loggedInUser) {
  const { status, remarks } = payload;

  // Find Ticket
  const ticket = await repository.findTicketById(ticketId);
  if (!ticket) {
    throw new AppError(404, "Ticket not found.");
  }

  // Closed Ticket
  if (ticket.status === "CLOSED") {
    throw new AppError(400, "Closed ticket cannot be modified.");
  }

  // Permission
  if (
    loggedInUser.role === "SUPPORT_ENGINEER" &&
    ticket.assignedToId !== loggedInUser.id
  ) {
    throw new AppError(403, "You are not assigned to this ticket.");
  }

  // Transition Validation
  const allowed = allowedTransitions[ticket.status];
  if (!allowed.includes(status)) {
    throw new AppError(
      400,
      `Cannot change ticket status from ${ticket.status} to ${status}.`,
    );
  }

  // resolvedAt
  const resolvedAt = status === "RESOLVED" ? new Date() : ticket.resolvedAt;

  // Update
  const updatedTicket = await repository.updateStatusWithHistory(
    ticket.id,
    status,
    ticket.status,
    remarks,
    loggedInUser.id,
    resolvedAt,
  );

  logger.info(
    `Ticket ${ticket.ticketNumber} status changed from ${ticket.status} to ${status}`,
  );

  return updatedTicket;
}

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  addComment,
  uploadAttachment,
  reassignTicket,
  updateTicketStatus,
};
