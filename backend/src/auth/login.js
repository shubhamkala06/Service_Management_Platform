const client = require("openid-client");

const config = require("../config/env");
const {getConfiguration} = require("./client");

async function buildAuthorizationRequest() {
    const oidc = getConfiguration();

    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

    const state = client.randomState();
    const nonce = client.randomNonce();

    const authorizationUrl = client.buildAuthorizationUrl(oidc, {
        redirect_uri: config.oidc.redirect_uri,
        scope: "openid profile email",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state,
        nonce,
    });
    
    return {
        authorizationUrl,
        protocolState: {
            state,
            nonce,
            codeVerifier,
        },
    };

}

module.exports = {
    buildAuthorizationRequest,
}