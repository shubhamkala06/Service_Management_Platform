const AppError = require("./AppError");

function notFoundHandler(req, res, next) {
    next(new AppError("Resource not found.", 404));
}

module.exports = notFoundHandler;