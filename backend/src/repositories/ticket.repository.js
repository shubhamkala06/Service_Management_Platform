const prisma = require("../config/prisma");

async function findCategoryById(categoryId) {
  return prisma.supportCategory.findFirst({
    where: {
      id: categoryId,
      isActive: true,
    },
    include: {
      slaPolicies: {
        where: {
          isActive: true,
        },
      },
    },
  });
}

async function getLastTicket() {
  return prisma.ticket.findFirst({
    orderBy: {
      id: "desc",
    },
  });
}

async function createTicketWithHistory(ticketData, historyData) {
  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.create({
      data: ticketData,
    });

    await tx.ticketStatusHistory.create({
      data: {
        ...historyData,
        ticketId: ticket.id,
      },
    });

    return ticket;
  });
}

module.exports = {
  findCategoryById,
  getLastTicket,
  createTicketWithHistory,
};
