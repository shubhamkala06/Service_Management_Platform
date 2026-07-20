function validateApprovalDecision(req, res, next) {
  const { remarks } = req.body;

  if (remarks && typeof remarks !== "string") {
    return res.status(400).json({
      message: "Remarks must be a string.",
    });
  }

  next();
}

module.exports = {
  validateApprovalDecision,
};
