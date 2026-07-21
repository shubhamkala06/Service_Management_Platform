function generateTicketNumber(lastTicketId) {
  const year = new Date().getFullYear();

  const sequence = String(lastTicketId + 1).padStart(6, "0");

  return `TKT-${year}-${sequence}`;
}

module.exports = {
  generateTicketNumber,
};
