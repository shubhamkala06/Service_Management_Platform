const ticketService = require("../services/ticket.service");
const sendResponse = require("../utils/response.util");

async function createTicket(req, res, next) {
  try {
    const ticket = await ticketService.createTicket(req.body, req.user.id);
    return sendResponse(res, 201, "Ticket created successfully.", ticket);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTicket,
};
