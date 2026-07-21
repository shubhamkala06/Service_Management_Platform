const crypto = require("node:crypto");

const { createUser } = require("../user");
const { buildAuthorizationRequest } = require("./services/login");
const { exchangeAuthorizationCode } = require("./services/callback");
const { saveRefreshTokenSession } = require("./services/refreshToken");

const {
    storeLoginState,
    readLoginState,
    clearLoginState,
} = require("./loginState");

const { AppError } = require("../errors");
const config = require("../config/env");

async function login(req, res) {
    const { authorizationUrl, loginState } =
        await buildAuthorizationRequest();

    storeLoginState(res, loginState);

    res.redirect(authorizationUrl.href);
}

async function callback(req, res) {
    const loginState = readLoginState(req);

    if (!loginState) {
        throw new AppError("Invalid login request.", 400);
    }

    const currentUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    const identity = await exchangeAuthorizationCode({
        currentUrl,
        loginState,
    });

    clearLoginState(res);

    const userInfo = {
        oidcSubject: identity.claims.sub,
        email: identity.claims.email,
        firstName: identity.claims.first_name,
        lastName: identity.claims.last_name,
        department: identity.claims.department,
        dateOfJoining: new Date(identity.claims.date_of_joining),
    }

    await createUser(userInfo);

    const sessionId = crypto.randomUUID();

    await saveRefreshTokenSession(sessionId, {
        refreshToken: identity.tokenSet.refresh_token,
        idToken: identity.tokenSet.id_token,
    });

    res.cookie("refresh_session_id", sessionId, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    res.cookie("access_token", identity.tokenSet.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    res.redirect(`${config.frontend.url}/`);
}

module.exports = {
    login,
    callback,
};