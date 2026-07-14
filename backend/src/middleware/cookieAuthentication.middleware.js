const { verifyJWT } = require("../auth");
const {AppError} = require("../errors");

async function authenticate(req, res, next) {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            throw new AppError("Access token missing",401);
        }

        const claims = await verifyJWT(token);
        req.user = claims;

        next();
    } catch (err) {
        throw new AppError("Invalid access token",401);
    }
}

module.exports = {authenticate};