const assetService = require("./service.js");

/**
 * Create Asset
 */
const createAsset = async (req, res, next) => {
  try {
    const asset = await assetService.createAsset(req.body);

    return res.status(201).json({
      success: true,
      message: "Asset created successfully",
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Assets
 */
const getAssets = async (req, res, next) => {
  try {
    const assets = await assetService.getAssets(req.query);

    return res.status(200).json({
      success: true,
      message: "Assets fetched successfully",
      data: assets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Asset By Id
 */
const getAssetById = async (req, res, next) => {
  try {
    const asset = await assetService.getAssetById(Number(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Asset fetched successfully",
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Asset
 */
const updateAsset = async (req, res, next) => {
  try {
    const asset = await assetService.updateAsset(
      Number(req.params.id),
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Asset updated successfully",
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Asset (Soft Delete)
 */
const deleteAsset = async (req, res, next) => {
  try {
    await assetService.deleteAsset(Number(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Assignment
 */
const getCurrentAssignment = async (req, res, next) => {
  try {
    const assignment = await assetService.getCurrentAssignment(
      Number(req.params.id),
    );

    return res.status(200).json({
      success: true,
      message: "Current assignment fetched successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Assignment History
 */
const getAssignmentHistory = async (req, res, next) => {
  try {
    const history = await assetService.getAssignmentHistory(
      Number(req.params.id),
    );

    return res.status(200).json({
      success: true,
      message: "Assignment history fetched successfully",
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  getCurrentAssignment,
  getAssignmentHistory,
};
