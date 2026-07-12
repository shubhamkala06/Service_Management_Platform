const oidc = require("openid-client");

// const config = require("../config/env");
const { getConfiguration } = require("./client");

async function exchangeAuthorizationCode({
    currentUrl,
    loginState,
}) {
    const configuration = getConfiguration();

    const tokenSet = await oidc.authorizationCodeGrant(
        configuration,
        new URL(currentUrl),
        {
            pkceCodeVerifier: loginState.codeVerifier,
            expectedState: loginState.state,
            expectedNonce: loginState.nonce,
        }
    );

    const claims = tokenSet.claims();

    const userInfo = await oidc.fetchUserInfo(
        configuration,
        tokenSet.access_token,
        claims.sub
    );

    return {
        tokenSet,
        claims,
        userInfo,
    };
}

module.exports = {
    exchangeAuthorizationCode,
};