const repository = require("../repositories/ticket.repository");
const { calculateDeadline } = require("../utils/sla.util");
const { generateTicketNumber } = require("../utils/ticket-number.util");

const TicketStatus = {
  OPEN: "OPEN",
};

async function createTicket(payload, userId) {
  const { title, description, priority, categoryId } = payload;

  // Category Validation
  const category = await repository.findCategoryById(categoryId);
  if (!category) {
    throw new Error("Support category not found.");
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

module.exports = {
  createTicket,
};
