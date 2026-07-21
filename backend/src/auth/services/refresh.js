const oidc = require("openid-client");

const { getConfiguration } = require("../client");

async function refreshAccessToken(refreshToken) {
    const configuration = getConfiguration();

    const tokenSet = await oidc.refreshTokenGrant(
        configuration,
        refreshToken
    );

    return {
        tokenSet,
    };
}

module.exports = {
    refreshAccessToken,
};