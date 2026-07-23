const TicketPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};
const TicketPurpose = {
  SUPPORT: "SUPPORT",
  REQUEST: "REQUEST",
};
const TicketStatus = {
  OPEN: "OPEN",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  PENDING_USER_RESPONSE: "PENDING_USER_RESPONSE",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
};

function validateCreateTicket(req, res, next) {
  const { title, description, purpose, priority, status, categoryId } =
    req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required.",
    });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({
      message: "Description is required.",
    });
  }

  if (!priority) {
    return res.status(400).json({
      message: "Priority is required.",
    });
  }

  if (!Object.values(TicketPriority).includes(priority)) {
    return res.status(400).json({
      message: "Invalid priority.",
    });
  }

  if (!categoryId || isNaN(categoryId)) {
    return res.status(400).json({
      message: "Valid categoryId is required.",
    });
  }
  if (!purpose) {
    return res.status(400).json({
      message: "Purpose is required.",
    });
  }
  if (!Object.values(TicketPurpose).includes(purpose)) {
    return res.status(400).json({
      message: "Invalid purpose.",
    });
  }
  // if (!Object.values(TicketStatus).includes(status)) {
  //   return res.status(400).json({
  //     message: "Invalid status.",
  //   });
  // }

  next();
}
function validateTicketId(req, res, next) {
  const ticketId = Number(req.params.ticketId);

  if (Number.isNaN(ticketId)) {
    return res.status(400).json({
      message: "Invalid ticket id.",
    });
  }

  next();
}
function validateAddComment(req, res, next) {
  const { content } = req.body;
  if (!content || content.trim() === "") {
    return res.status(400).json({
      message: "Comment is required.",
    });
  }
  next();
}

function validateAssignTicket(req, res, next) {
  const { assignedToId } = req.body;

  if (!assignedToId) {
    return res.status(400).json({
      message: "assignedToId is required.",
    });
  }

  if (isNaN(assignedToId)) {
    return res.status(400).json({
      message: "assignedToId must be a number.",
    });
  }

  next();
}

function validateUpdateStatus(req, res, next) {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({
      message: "Status is required.",
    });
  }
  next();
}

module.exports = {
  validateCreateTicket,
  validateTicketId,
  validateAddComment,
  validateAssignTicket,
  validateUpdateStatus,
};
