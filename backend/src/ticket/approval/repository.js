const prisma = require("../../database");
/* ===========================================================
   TICKET
=========================================================== */

async function findTicketWithCreator(ticketId) {
  return prisma.ticket.findUnique({
    where: {
      id: Number(ticketId),
    },

    include: {
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          department: true,
        },
      },

      assignedTo: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },

      category: true,

      approval: true,
    },
  });
}

/* ===========================================================
   MANAGER
=========================================================== */

async function findManagerByDepartment(department) {
  return prisma.user.findFirst({
    where: {
      department,

      isActive: true,

      role: {
        name: "Manager",
      },
    },

    include: {
      role: true,
    },
  });
}

/* ===========================================================
   APPROVAL
=========================================================== */

async function findApprovalByTicket(ticketId) {
  return prisma.approval.findUnique({
    where: {
      ticketId: Number(ticketId),
    },
  });
}

async function createApproval(data) {
  return prisma.approval.create({
    data,

    include: {
      approver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },

      ticket: {
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          purpose: true,
        },
      },
    },
  });
}

/* ===========================================================
   MANAGER DASHBOARD
=========================================================== */

async function getPendingApprovals(managerId) {
  return prisma.approval.findMany({
    where: {
      approverId: Number(managerId),

      decision: "PENDING",
    },

    include: {
      ticket: {
        include: {
          createdBy: {
            select: {
              id: true,
              employeeCode: true,
              firstName: true,
              lastName: true,
              department: true,
            },
          },

          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },

          category: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

/* ===========================================================
   APPROVAL DETAILS
=========================================================== */

async function findApprovalById(id) {
  return prisma.approval.findUnique({
    where: {
      id: Number(id),
    },

    include: {
      approver: true,

      ticket: {
        include: {
          createdBy: true,
          assignedTo: true,
          category: true,
        },
      },
    },
  });
}

/* ===========================================================
   APPROVE
=========================================================== */

async function approveApprovalWithHistory(approvalId, remarks, managerId) {
  return prisma.$transaction(async (tx) => {
    const approval = await tx.approval.update({
      where: {
        id: Number(approvalId),
      },

      data: {
        decision: "APPROVED",
        remarks,
        approvedOn: new Date(),
      },

      include: {
        ticket: true,
      },
    });

    await tx.ticket.update({
      where: {
        id: approval.ticketId,
      },

      data: {
        status: "IN_PROGRESS",
      },
    });

    await tx.ticketStatusHistory.create({
      data: {
        ticketId: approval.ticketId,
        oldStatus: "PENDING_USER_RESPONSE",
        newStatus: "IN_PROGRESS",
        remarks: "Request approved by manager.",
        changedById: Number(managerId),
      },
    });

    return approval;
  });
}

/* ===========================================================
   REJECT
=========================================================== */

async function rejectApprovalWithHistory(approvalId, remarks, managerId) {
  return prisma.$transaction(async (tx) => {
    const approval = await tx.approval.update({
      where: {
        id: Number(approvalId),
      },

      data: {
        decision: "REJECTED",
        remarks,
        approvedOn: new Date(),
      },

      include: {
        ticket: true,
      },
    });

    await tx.ticket.update({
      where: {
        id: approval.ticketId,
      },

      data: {
        status: "CLOSED",
      },
    });

    await tx.ticketStatusHistory.create({
      data: {
        ticketId: approval.ticketId,
        oldStatus: "PENDING_USER_RESPONSE",
        newStatus: "CLOSED",
        remarks: "Request rejected by manager.",
        changedById: Number(managerId),
      },
    });

    return approval;
  });
}

module.exports = {
  findTicketWithCreator,
  findManagerByDepartment,
  findApprovalByTicket,
  createApproval,
  getPendingApprovals,
  findApprovalById,
  approveApprovalWithHistory,
  rejectApprovalWithHistory,
};
