const TicketPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

function validateCreateTicket(req, res, next) {
  const { title, description, priority, categoryId } = req.body;

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

  next();
}

module.exports = {
  validateCreateTicket,
};
