const { logger } = require("../logger");

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;

    const logData = {
        err,
        request: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
        },
    };

    if (statusCode >= 500) {
        logger.error(logData, "Request failed");
    }
    else if (statusCode >= 400) {
        logger.warn(logData, "Client request failed");
    }

    const message =
        statusCode >= 500
            ? "Internal Server Error"
            : err.message;

    res.status(statusCode).json({
        success: false,
        message,
    });
}

module.exports = errorHandler;