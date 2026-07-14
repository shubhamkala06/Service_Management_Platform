const oidc = require("openid-client");

const { getConfiguration } = require("../client");

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
    
    return {
        tokenSet,
        claims,
    };
}

module.exports = {
    exchangeAuthorizationCode,
};