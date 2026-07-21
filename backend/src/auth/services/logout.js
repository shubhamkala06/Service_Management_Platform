const oidc = require("openid-client");

const config = require("../../config/env");
const { getConfiguration } = require("../client");

async function revokeRefreshToken(refreshToken) {
    const configuration = getConfiguration();

    await oidc.tokenRevocation(
        configuration,
        refreshToken,
        {
            token_type_hint: "refresh_token",
        }
    );
}


function buildLogoutUrl(idToken) {
    const configuration = getConfiguration();

    return oidc.buildEndSessionUrl(
        configuration,
        {
            id_token_hint: idToken,
            post_logout_redirect_uri:
                config.frontend.url,
        }
    );
}

module.exports = {
    revokeRefreshToken,
    buildLogoutUrl
}