const express = require("express");

const assetController = require("./controller.js");

// middlewares
const { authenticate, authorize } = require("../middleware/index.js");
const validate = require("../middleware/validate.middleware.js");

// validations
const {
  createAssetSchema,
  updateAssetSchema,
  assetIdParamSchema,
  getAssetsQuerySchema,
  assignAssetSchema,
  returnAssetSchema,
} = require("./validation.js");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Asset CRUD
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "SUPPORT_ENGINEER"]),
  validate(createAssetSchema),
  assetController.createAsset,
);

router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "SUPPORT_ENGINEER", "MANAGER"]),
  validate(getAssetsQuerySchema, "query"),
  assetController.getAssets,
);

router.get(
  "/:id",
  authenticate,
  authorize(["ADMIN", "SUPPORT_ENGINEER", "MANAGER"]),
  validate(assetIdParamSchema, "params"),
  assetController.getAssetById,
);

router.patch(
  "/:id",
  authenticate,
  authorize(["ADMIN", "SUPPORT_ENGINEER"]),
  validate(assetIdParamSchema, "params"),
  validate(updateAssetSchema),
  assetController.updateAsset,
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validate(assetIdParamSchema, "params"),
  assetController.deleteAsset,
);

/*
|--------------------------------------------------------------------------
| Assignment
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/current-assignment",
  authenticate,
  authorize(["ADMIN", "SUPPORT_ENGINEER", "MANAGER"]),
  validate(assetIdParamSchema, "params"),
  assetController.getCurrentAssignment,
);

router.get(
  "/:id/history",
  authenticate,
  authorize(["ADMIN", "SUPPORT_ENGINEER", "MANAGER"]),
  validate(assetIdParamSchema, "params"),
  assetController.getAssignmentHistory,
);

router.post(
  "/:id/assign",
  authenticate,
  authorize(["ADMIN", "SUPPORT_ENGINEER"]),
  validate(assetIdParamSchema, "params"),
  validate(assignAssetSchema),
  assetController.assignAsset,
);

router.post(
  "/:id/return",
  authenticate,
  authorize(["ADMIN", "SUPPORT_ENGINEER"]),
  validate(assetIdParamSchema, "params"),
  validate(returnAssetSchema),
  assetController.returnAsset,
);

router.post(
  "/:id/transfer",
  authenticate,
  authorize(["ADMIN", "SUPPORT_ENGINEER"]),
  validate(assetIdParamSchema, "params"),
  validate(assignAssetSchema),
  assetController.transferAsset,
);

module.exports = router;
