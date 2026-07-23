const prisma = require("../database/index.js");

const assetInclude = {
  hardware: true,
  software: true,
  other: true,
  assignments: {
    where: {
      returnDate: null,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  },
};

class AssetRepository {
  async createAsset(payload) {
    const { hardware, software, other, ...assetData } = payload;

    return prisma.$transaction(async (tx) => {
      return tx.asset.create({
        data: {
          ...assetData,

          ...(assetData.assetType === "HARDWARE" && {
            hardware: {
              create: hardware,
            },
          }),

          ...(assetData.assetType === "SOFTWARE" && {
            software: {
              create: software,
            },
          }),

          ...(assetData.assetType === "OTHER" && {
            other: {
              create: other,
            },
          }),
        },
        include: assetInclude,
      });
    });
  }

  async updateAsset(id, payload) {
    const { hardware, software, other, assetTag, assetType, ...assetData } =
      payload;

    return prisma.$transaction(async (tx) => {
      if (Object.keys(assetData).length) {
        await tx.asset.update({
          where: {
            id,
          },
          data: assetData,
        });
      }

      const asset = await tx.asset.findUnique({
        where: {
          id,
        },
        select: {
          assetType: true,
        },
      });

      if (asset.assetType === "HARDWARE" && hardware) {
        await tx.hardware.update({
          where: {
            assetId: id,
          },
          data: hardware,
        });
      }

      if (asset.assetType === "SOFTWARE" && software) {
        await tx.software.update({
          where: {
            assetId: id,
          },
          data: software,
        });
      }

      if (asset.assetType === "OTHER" && other) {
        await tx.other.update({
          where: {
            assetId: id,
          },
          data: other,
        });
      }

      return tx.asset.findUnique({
        where: {
          id,
        },
        include: assetInclude,
      });
    });
  }

  async deactivateAsset(id) {
    return prisma.asset.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async findById(id) {
    return prisma.asset.findUnique({
      where: {
        id,
      },
      include: assetInclude,
    });
  }

  async findByAssetTag(assetTag) {
    return prisma.asset.findUnique({
      where: {
        assetTag,
      },
    });
  }

  async findMany(where, skip, take) {
    return prisma.asset.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: assetInclude,
    });
  }

  async count(where) {
    return prisma.asset.count({
      where,
    });
  }

  async exists(id) {
    return prisma.asset.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        isActive: true,
      },
    });
  }

  async getCurrentAssignment(assetId) {
    return prisma.assetAssignment.findFirst({
      where: {
        assetId,
        returnDate: null,
      },
      include: {
        user: true,
      },
    });
  }

  async createAssignment(data) {
    return prisma.assetAssignment.create({
      data,
    });
  }

  async assignAsset(assetId, userId, assignedById, remarks) {
    return prisma.$transaction(async (tx) => {
      const assignment = await tx.assetAssignment.create({
        data: {
          assetId,
          userId,
          assignedById,
          remarks,
        },
        include: {
          asset: true,
          user: true,
          assignedBy: true,
        },
      });

      await tx.asset.update({
        where: {
          id: assetId,
        },
        data: {
          assetStatus: "ASSIGNED",
        },
      });

      return assignment;
    });
  }

  /**
   * Return Assigned Asset
   */
  async returnAsset(assignmentId, remarks) {
    return prisma.$transaction(async (tx) => {
      // Close current assignment
      const assignment = await tx.assetAssignment.update({
        where: {
          id: assignmentId,
        },
        data: {
          returnDate: new Date(),
          remarks,
        },
        include: {
          asset: {
            select: {
              id: true,
              assetTag: true,
              assetType: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Make asset available again
      await tx.asset.update({
        where: {
          id: assignment.asset.id,
        },
        data: {
          assetStatus: "AVAILABLE",
        },
      });

      return assignment;
    });
  }

  async assignmentHistory(assetId) {
    return prisma.assetAssignment.findMany({
      where: {
        assetId,
      },
      include: {
        user: true,
        assignedBy: true,
      },
      orderBy: {
        assignedDate: "desc",
      },
    });
  }

  /**
   * Transfer Asset
   */
  async transferAsset(
    assetId,
    currentAssignmentId,
    newUserId,
    assignedById,
    remarks,
  ) {
    return prisma.$transaction(async (tx) => {
      // Close previous assignment
      await tx.assetAssignment.update({
        where: {
          id: currentAssignmentId,
        },
        data: {
          returnDate: new Date(),
          remarks,
        },
      });

      // Create new assignment
      const assignment = await tx.assetAssignment.create({
        data: {
          assetId,
          userId: newUserId,
          assignedById,
          remarks,
        },
        include: {
          asset: {
            select: {
              id: true,
              assetTag: true,
              assetType: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return assignment;
    });
  }
}

module.exports = new AssetRepository();
