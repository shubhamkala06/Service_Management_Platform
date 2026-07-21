const { createRemoteJWKSet, jwtVerify } = require("jose");

const config = require("../../config/env");
const { AppError } = require("../../errors");
const { getConfiguration } = require("../client");
const { getUserByOidcSubject } = require("../../user");

let jwks;

function getJwks() {
    if (!jwks) {
        const configuration = getConfiguration();
        const metadata = configuration.serverMetadata();

        jwks = createRemoteJWKSet(
            new URL(metadata.jwks_uri)
        );
    }

    return jwks;
}

async function validateAccessToken(token) {
    const configuration = getConfiguration();
    const metadata = configuration.serverMetadata();

    const { payload } = await jwtVerify(
        token,
        getJwks(),
        {
            issuer: metadata.issuer,
            audience: config.oidc.client_id,
        }
    );

    const user = await getUserByOidcSubject(payload.sub);

    if (!user) {
        throw new AppError("User not found.", 401);
    }

    if (!user.isActive) {
        throw new AppError("User account is inactive.", 403);
    }

    return user;
}

module.exports = {
    validateAccessToken,
};