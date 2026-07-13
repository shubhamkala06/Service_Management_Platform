const {verifyJWT} = require("../auth");
const userRepository = require("../user/repository");       //will have to change this
const { AppError } = require("../errors");

async function requireAuth(req, res, next) {
    const authorization = req.get("Authorization");

    if (!authorization) {
        throw new AppError("Authentication required.", 401);
    }

    if (!authorization.startsWith("Bearer ")) {
        throw new AppError("Invalid authorization header.", 401);
    }

    const token = authorization.substring(7);

    const payload = await verifyJWT(token);

    const user = await userRepository.findById(payload.sub);

    if (!user) {
        throw new AppError("Authentication required.", 401);
    }

    if (!user.isActive) {
        throw new AppError("User account is inactive.", 403);
    }

    req.user = user;

    next();
}

module.exports = {
    requireAuth,
};