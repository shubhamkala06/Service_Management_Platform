// const { jwtVerify } = require("jose");

//     const {payload} = await jwtVerify(token,secret,{
//         issuer: config.jwt.issuer,
//         audience: config.jwt.audience
//     });
//     return payload;
// }

// module.exports = {
//     verify
// };


const { createRemoteJWKSet, jwtVerify } = require("jose");

const config = require("../../config/env");
const { getConfiguration } = require("../client");
const {userRepsitory} = require("../../user");

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
    userInfo = await userRepsitory.findByOidcSubject(payload.sub);
    
    return userInfo;
}

module.exports = {
    validateAccessToken,
};