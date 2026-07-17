const { verifyJWT } = require("../auth");
const { AppError } = require("../errors");

async function authenticate(req, res, next) {
    const token = req.cookies.access_token;

    if (!token) {
        throw new AppError("Access token missing", 401);
    }

    try {
        const user = await verifyJWT(token);

        if (!user.isActive) {
            throw new AppError("User account is inactive", 403);
        }

        req.user = user;
        next();
    } catch (err) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError("Invalid access token", 401);
    }
}

module.exports = { authenticate };