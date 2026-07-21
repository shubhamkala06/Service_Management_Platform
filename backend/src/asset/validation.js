const { z } = require("zod");

const {
  AssetType,
  AssetStatus,
  AssetCondition,
  LicenseType,
} = require("@prisma/client");

/**
 * Hardware Validation
 */
const hardwareSchema = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  condition: z.nativeEnum(AssetCondition),
});

/**
 * Software Validation
 */
const softwareSchema = z.object({
  softwareName: z.string().min(1, "Software name is required"),
  version: z.string().min(1, "Version is required"),
  vendor: z.string().min(1, "Vendor is required"),
  licenseKey: z.string().optional().nullable(),
  licenseType: z.nativeEnum(LicenseType),
  expiryDate: z.coerce.date().optional().nullable(),
});

/**
 * Other Asset Validation
 */
const otherSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  description: z.string().optional().nullable(),
});

/**
 * Create Asset
 */
const createAssetSchema = z
  .object({
    assetTag: z.string().min(1, "Asset tag is required"),

    assetType: z.nativeEnum(AssetType),

    purchaseDate: z.coerce.date().optional().nullable(),

    warrantyExpiry: z.coerce.date().optional().nullable(),

    vendor: z.string().optional().nullable(),

    location: z.string().optional().nullable(),

    hardware: hardwareSchema.optional(),

    software: softwareSchema.optional(),

    other: otherSchema.optional(),
  })
  .superRefine((data, ctx) => {
    switch (data.assetType) {
      case AssetType.HARDWARE:
        if (!data.hardware) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["hardware"],
            message: "Hardware details are required",
          });
        }
        break;

      case AssetType.SOFTWARE:
        if (!data.software) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["software"],
            message: "Software details are required",
          });
        }
        break;

      case AssetType.OTHER:
        if (!data.other) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["other"],
            message: "Other asset details are required",
          });
        }
        break;
    }
  });

/**
 * Update Asset
 */
const updateAssetSchema = z.object({
  assetStatus: z.nativeEnum(AssetStatus).optional(),

  purchaseDate: z.coerce.date().optional().nullable(),

  warrantyExpiry: z.coerce.date().optional().nullable(),

  vendor: z.string().optional().nullable(),

  location: z.string().optional().nullable(),

  hardware: hardwareSchema.partial().optional(),

  software: softwareSchema.partial().optional(),

  other: otherSchema.partial().optional(),
});

/**
 * Route Params
 */
const assetIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Query Params
 */
const getAssetsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),

  search: z.string().optional(),

  assetType: z.nativeEnum(AssetType).optional(),

  assetStatus: z.nativeEnum(AssetStatus).optional(),
});

module.exports = {
  createAssetSchema,
  updateAssetSchema,
  assetIdParamSchema,
  getAssetsQuerySchema,
};
