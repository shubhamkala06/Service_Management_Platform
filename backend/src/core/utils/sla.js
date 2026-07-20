function calculateDeadline(resolutionTarget) {
  if (!resolutionTarget) {
    return null;
  }

  const deadline = new Date();

  deadline.setHours(deadline.getHours() + resolutionTarget);

  return deadline;
}

module.exports = {
  calculateDeadline,
};
