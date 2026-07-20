module.exports = {
    createTicket : require("./service").createTicket,
    getMyTickets : require("./service").getMyTickets,
    getTicketById : require("./service").getTicketById,
    addComment : require("./service").addComment,
    uploadAttachment : require("./service").uploadAttachment,
    reassignTicket : require("./service").reassignTicket,
    updateTicketStatus : require("./service").updateTicketStatus,
}