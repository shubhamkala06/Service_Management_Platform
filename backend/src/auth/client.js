const client = require("openid-client");
const config = require("../config/env");
const { logger } = require("../logger");

let oidcConfiguration;

async function initialize() {
    if (config.app.env === "development"){
        oidcConfiguration = await client.discovery(
            new URL(config.oidc.issuer),
            config.oidc.client_id,
            config.oidc.client_secret,
            undefined,
            {
                execute: [client.allowInsecureRequests],        //deprecated api being used as a workaround for escaping https
            }
        );
    }
    else{
        oidcConfiguration = await client.discovery(
            new URL(config.oidc.issuer),
            config.oidc.client_id,
            config.oidc.client_secret,
            undefined
        );
    }
    logger.info("OIDC client initialized.");
}

function getConfiguration() {
    if (!oidcConfiguration) {
        throw new Error(
            "OIDC configuration has not been initialized."
        );
    }

    return oidcConfiguration;
}

module.exports = {
    initialize,
    getConfiguration,
};