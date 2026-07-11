const { logger } = require("../logger");

function errorHandler(err, req, res, next) {
    logger.error(
        {
            err,
            request: {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip,
            },
        },
        "Request failed"
    );

    const statusCode = err.statusCode || 500;

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