const express = require("express");

const { authenticate, authorize } = require("../middleware");
const controller = require("./controller");

const router = express.Router();

router.get(
    "/me",
    authenticate,
    controller.getCurrentUser
);

router.get(
    "/",
    authenticate,
    authorize("System Administrator"),
    controller.listUsers
);

router.get(
    "/roles",
    authenticate,
    authorize("System Administrator"),
    controller.listRoles
);

router.get(
    "/:id",
    authenticate,
    authorize("System Administrator"),
    controller.getUser
);


router.patch(
    "/:id/role",
    authenticate,
    authorize("System Administrator"),
    controller.updateUserRole
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("System Administrator"),
    controller.updateUserStatus
);

module.exports = router;