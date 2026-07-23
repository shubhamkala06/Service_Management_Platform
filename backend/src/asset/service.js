const assetRepository = require("./repository.js");
const { AppError } = require("../errors/index.js");

class AssetService {
  /**
   * Create Asset
   */
  async createAsset(payload) {
    const existingAsset = await assetRepository.findByAssetTag(
      payload.assetTag,
    );

    if (existingAsset) {
      throw new AppError("Asset Tag already exists", 409);
    }

    return assetRepository.createAsset(payload);
  }

  /**
   * Get Asset By Id
   */
  async getAssetById(id) {
    const asset = await assetRepository.findById(id);

    if (!asset || !asset.isActive) {
      throw new AppError("Asset not found", 404);
    }

    return asset;
  }

  /**
   * Get Assets
   */
  async getAssets(query) {
    const { page = 1, limit = 10, search, assetType, assetStatus } = query;

    const where = {
      isActive: true,
    };

    if (assetType) {
      where.assetType = assetType;
    }

    if (assetStatus) {
      where.assetStatus = assetStatus;
    }

    if (search) {
      where.OR = [
        {
          assetTag: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          vendor: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          hardware: {
            is: {
              manufacturer: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          hardware: {
            is: {
              model: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          hardware: {
            is: {
              serialNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          software: {
            is: {
              softwareName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          other: {
            is: {
              itemName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const skip = (pageNumber - 1) * pageSize;

    const [assets, total] = await Promise.all([
      assetRepository.findMany(where, skip, pageSize),
      assetRepository.count(where),
    ]);

    return {
      assets,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Update Asset
   */
  async updateAsset(id, payload) {
    const asset = await assetRepository.findById(id);

    if (!asset || !asset.isActive) {
      throw new AppError("Asset not found", 404);
    }

    if (payload.assetTag && payload.assetTag !== asset.assetTag) {
      throw new AppError("Asset Tag cannot be updated", 400);
    }

    if (payload.assetType && payload.assetType !== asset.assetType) {
      throw new AppError("Asset Type cannot be updated", 400);
    }

    return assetRepository.updateAsset(id, payload);
  }

  /**
   * Delete Asset (Soft Delete)
   */
  async deleteAsset(id) {
    const asset = await assetRepository.findById(id);

    if (!asset) {
      throw new AppError("Asset not found", 404);
    }

    if (!asset.isActive) {
      throw new AppError("Asset is already inactive", 400);
    }

    const currentAssignment = await assetRepository.getCurrentAssignment(id);

    if (currentAssignment) {
      throw new AppError("Cannot deactivate an assigned asset", 400);
    }

    return assetRepository.deactivateAsset(id);
  }

  /**
   * Assignment History
   */
  async getAssignmentHistory(assetId) {
    const asset = await assetRepository.findById(assetId);

    if (!asset || !asset.isActive) {
      throw new AppError("Asset not found", 404);
    }

    return assetRepository.assignmentHistory(assetId);
  }

  /**
   * Current Assignment
   */
  async getCurrentAssignment(assetId) {
    const asset = await assetRepository.findById(assetId);

    if (!asset || !asset.isActive) {
      throw new AppError("Asset not found", 404);
    }

    return assetRepository.getCurrentAssignment(assetId);
  }

  async assignAsset(assetId, payload, assignedById) {
    const asset = await assetRepository.findById(assetId);

    if (!asset || !asset.isActive) {
      throw new AppError("Asset not found", 404);
    }

    if (asset.assetStatus !== "AVAILABLE") {
      throw new AppError("Asset is not available for assignment", 400);
    }

    const currentAssignment =
      await assetRepository.getCurrentAssignment(assetId);

    if (currentAssignment) {
      throw new AppError("Asset is already assigned", 400);
    }

    return assetRepository.assignAsset(
      assetId,
      payload.userId,
      assignedById,
      payload.remarks,
    );
  }

  async returnAsset(assetId, payload) {
    const asset = await assetRepository.findById(assetId);

    if (!asset || !asset.isActive) {
      throw new AppError("Asset not found", 404);
    }

    if (asset.assetStatus !== "ASSIGNED") {
      throw new AppError("Asset is not assigned", 400);
    }

    const assignment = await assetRepository.getCurrentAssignment(assetId);

    if (!assignment) {
      throw new AppError("No active assignment found", 404);
    }

    return assetRepository.returnAsset(assignment.id, payload.remarks);
  }

  async transferAsset(assetId, payload, assignedById) {
    const asset = await assetRepository.findById(assetId);
    if (!asset || !asset.isActive) {
      throw new AppError("Asset not found", 404);
    }
    if (asset.assetStatus !== "ASSIGNED") {
      throw new AppError("Asset is not assigned", 400);
    }
    const currentAssignment =
      await assetRepository.getCurrentAssignment(assetId);
    if (!currentAssignment) {
      throw new AppError("No active assignment found", 404);
    }
    if (currentAssignment.userId === payload.userId) {
      throw new AppError("Asset is already assigned to this user", 400);
    }

    return assetRepository.transferAsset(
      assetId,
      currentAssignment.id,
      payload.userId,
      assignedById,
      payload.remarks,
    );
  }
}

module.exports = new AssetService();
