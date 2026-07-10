const ticketService = require("../services/ticket.service");
const sendResponse = require("../utils/response.util");
const logger = require("../config/logger");
const { get } = require("../app");
async function createTicket(req, res, next) {
  try {
    logger.info(`Create Ticket API called by User ID ${req.user.id}`);
    const ticket = await ticketService.createTicket(req.body, req.user.id);
    return sendResponse(res, 201, "Ticket created successfully.", ticket);
  } catch (error) {
    logger.error(`Create Ticket API failed. Error: ${error.message}`);
    next(error);
  }
}

async function getMyTickets(req, res, next) {
  try {
    const tickets = await ticketService.getMyTickets(req.user.id, req.query);
    return sendResponse(res, 200, "Tickets fetched successfully.", {
      total: result.total,
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 10),
      tickets: result.tickets,
    });
  } catch (error) {
    next(error);
  }
}

async function getTicketById(req, res, next) {
  try {
    const ticket = await ticketService.getTicketById(
      req.params.ticketId,
      req.user,
    );
    return sendResponse(res, 200, "Ticket fetched successfully.", ticket);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
};
