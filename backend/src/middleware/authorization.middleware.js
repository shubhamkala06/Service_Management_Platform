const AppError = require("../errors/AppError.js");

function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401);
    }

    if (!req.user.role.isActive) {
      throw new AppError("Role is inactive.", 403);
    }

    if (!allowedRoles.includes(req.user.role.name)) {
      throw new AppError("You are not authorized to perform this action.", 403);
    }

    next();
  };
}

module.exports = {
  requireRoles,
};
