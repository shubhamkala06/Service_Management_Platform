const oidc = require("openid-client");

const config = require("../../config/env");
const { getConfiguration } = require("../client");

async function buildAuthorizationRequest() {
    const configuration = getConfiguration();

    const codeVerifier = oidc.randomPKCECodeVerifier();
    const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);

    const state = oidc.randomState();
    const nonce = oidc.randomNonce();

    const authorizationUrl = oidc.buildAuthorizationUrl(configuration, {
        redirect_uri: config.oidc.redirect_uri,
        scope: "openid email employee",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state,
        nonce,
    });

    return {
        authorizationUrl,
        loginState: {
            state,
            nonce,
            codeVerifier,
        },
    };
}

module.exports = {
    buildAuthorizationRequest,
};