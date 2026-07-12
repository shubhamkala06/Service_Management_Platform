const {buildAuthorizationRequest} = require("./login");

async function login(req,res) {
    const {authorizationUrl,protocolState} = await buildAuthorizationRequest();

    res.cookie(
        "oidc_state",
        JSON.stringify(protocolState),
        {
            httpOnly: true,
            signed: true,
            sameSite: "lax",
            // secure: process.env.NODE_ENV === "production",
            maxAge: 3 * 60 * 1000,
        }
    );

    res.redirect(authorizationUrl.href);

}

module.exports = {
    login,
};