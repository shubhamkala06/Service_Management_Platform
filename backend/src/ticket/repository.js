const prisma = require("../database/prisma.js");

async function findUserById(userId) {
  return prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      role: true,
      supportTeam: true,
    },
  });
}

async function findCategoryById(categoryId) {
  return prisma.supportCategory.findUnique({
    where: {
      id: Number(categoryId),
    },
    include: {
      SlaPolicy: true,
      supportTeam: true,
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

async function getTicketsByUserId(userId, filters) {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    categoryId,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = filters;

  const where = {
    createdById: Number(userId),
  };

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [tickets, total] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,

      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },

        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },

      skip: (page - 1) * Number(limit),
      take: Number(limit),

      orderBy: {
        [sortBy]: order,
      },
    }),

    prisma.ticket.count({
      where,
    }),
  ]);

  return {
    tickets,
    total,
  };
}

async function getTicketById(ticketId) {
  return prisma.ticket.findUnique({
    where: {
      id: Number(ticketId),
    },

    include: {
      category: true,

      slaPolicy: true,

      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          department: true,
        },
      },

      assignedTo: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },

      comments: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },

          attachments: true,
        },

        orderBy: {
          createdOn: "asc",
        },
      },

      approval: {
        include: {
          approver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },

      statusHistory: {
        include: {
          changedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },

        orderBy: {
          changedOn: "asc",
        },
      },
    },
  });
}

async function findTicketById(ticketId) {
  return prisma.ticket.findUnique({
    where: {
      id: Number(ticketId),
    },
    include: {
      category: {
        include: {
          supportTeam: true,
        },
      },
      assignedTo: true,
      createdBy: true,
      slaPolicy: true,
      comments: true,
      approval: true,
      statusHistory: true,
    },
  });
}

async function createComment(commentData) {
  return prisma.comment.create({
    data: commentData,

    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

async function createAttachment(data) {
  return prisma.attachment.create({
    data,
  });
}

/* ===========================================================
   AUTO ASSIGNMENT
=========================================================== */

async function findLeastLoadedEngineer(supportTeamId) {
  const engineers = await prisma.user.findMany({
    where: {
      role: {
        name: "Support Engineer",
      },

      supportTeamId: Number(supportTeamId),

      isActive: true,
    },

    include: {
      _count: {
        select: {
          assignedTickets: {
            where: {
              status: {
                in: ["ASSIGNED", "IN_PROGRESS", "PENDING_USER_RESPONSE"],
              },
            },
          },
        },
      },
    },
  });

  if (engineers.length === 0) {
    return null;
  }

  return engineers.sort(
    (a, b) => a._count.assignedTickets - b._count.assignedTickets,
  )[0];
}

/* ===========================================================
   REASSIGN TICKET
=========================================================== */

async function reassignTicketWithHistory(ticketId, assignedToId, adminId) {
  return prisma.$transaction(async (tx) => {
    const updatedTicket = await tx.ticket.update({
      where: {
        id: Number(ticketId),
      },

      data: {
        assignedToId: Number(assignedToId),
        status: "ASSIGNED",
      },
    });

    await tx.ticketStatusHistory.create({
      data: {
        ticketId: Number(ticketId),
        oldStatus: "OPEN",
        newStatus: "ASSIGNED",
        remarks: "Ticket reassigned.",
        changedById: Number(adminId),
      },
    });

    return updatedTicket;
  });
}

async function updateStatusWithHistory(
  ticketId,
  newStatus,
  oldStatus,
  remarks,
  changedById,
  resolvedAt = null,
) {
  return prisma.$transaction(async (tx) => {
    const updatedTicket = await tx.ticket.update({
      where: {
        id: Number(ticketId),
      },

      data: {
        status: newStatus,
        resolvedAt,
      },
    });

    await tx.ticketStatusHistory.create({
      data: {
        ticketId: Number(ticketId),
        oldStatus,
        newStatus,
        remarks,
        changedById: Number(changedById),
      },
    });

    return updatedTicket;
  });
}

module.exports = {
  findUserById,
  findCategoryById,
  getLastTicket,
  createTicketWithHistory,
  getTicketsByUserId,
  getTicketById,
  findTicketById,
  createComment,
  createAttachment,
  findLeastLoadedEngineer,
  reassignTicketWithHistory,
  updateStatusWithHistory,
};
