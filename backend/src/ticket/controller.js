const ticketService = require("./service.js");
const sendResponse = require("../core/utils/response.js");
const { logger } = require("../logger/index.js");
const { AppError } = require("../errors/index.js");

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
    const result = await ticketService.getMyTickets(req.user.id, req.query);
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
    // console.log(req.user);
    return sendResponse(res, 200, "Ticket fetched successfully.", ticket);
  } catch (error) {
    next(error);
  }
}

async function addComment(req, res, next) {
  try {
    const comment = await ticketService.addComment(
      req.params.ticketId,
      req.body.content,
      req.user,
    );
    return sendResponse(res, 201, "Comment added successfully.", comment);
  } catch (error) {
    next(error);
  }
}

async function uploadAttachment(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError(400, "No file uploaded.");
    }
    const attachment = await ticketService.uploadAttachment(
      req.params.commentId,
      req.file,
      req.user,
    );
    return sendResponse(
      res,
      201,
      "Attachment uploaded successfully.",
      attachment,
    );
  } catch (error) {
    next(error);
  }
}

async function reassignTicket(req, res, next) {
  try {
    const ticket = await ticketService.assignTicket(
      req.params.ticketId,
      req.body.assignedToId,
      req.user,
    );
    return sendResponse(res, 200, "Ticket Reassigned successfully.", ticket);
  } catch (error) {
    next(error);
  }
}

async function updateTicketStatus(req, res, next) {
  try {
    const ticket = await ticketService.updateTicketStatus(
      req.params.ticketId,
      req.body,
      req.user,
    );
    return sendResponse(
      res,
      200,
      "Ticket status updated successfully.",
      ticket,
    );
  } catch (error) {
    next(error);
  }
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
