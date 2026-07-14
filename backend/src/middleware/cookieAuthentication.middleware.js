const { verifyJWT } = require("../auth");
const {AppError} = require("../errors");

async function authenticate(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        throw new AppError("Access token missing",401);
    }

    try{
        const claims = await verifyJWT(token);
        req.user = claims;
    }
    catch (err) {
        throw new AppError("Invalid access token",401);
    }

    next();
}

module.exports = {authenticate};