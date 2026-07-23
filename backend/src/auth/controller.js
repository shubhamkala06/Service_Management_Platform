const crypto = require("node:crypto");

const { createUser } = require("../user");
const { buildAuthorizationRequest } = require("./services/login");
const { exchangeAuthorizationCode } = require("./services/callback");
const { saveRefreshTokenSession, getRefreshTokenSession, deleteRefreshTokenSession } = require("./services/refreshToken");

const {
    revokeRefreshToken,
    buildLogoutUrl
} = require("./services/logout");
const {
    storeLoginState,
    readLoginState,
    clearLoginState,
} = require("./loginState");

const { AppError } = require("../errors");
const config = require("../config/env");

async function login(req, res) {
  const { authorizationUrl, loginState } = await buildAuthorizationRequest();

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

async function logout(req, res) {
    const sessionId = req.cookies?.refresh_session_id;

    let logoutUrl;

    if (sessionId) {
        const session = await getRefreshTokenSession(sessionId);

        if (session) {
            // try {
            //     await revokeRefreshToken(
            //         session.refreshToken
            //     );
            // }
            // catch (err) {
            //     //Currenlty doing nothing specific for this error. Just clear the cookies and remove session.
            //     // if (err.error === "invalid_token") {
            //     //     console.warn("Refresh token already invalid during logout.");           //will have to decide what to do here
            //     // } else {
            //     //     console.error("Unexpected error while revoking refresh token:", err);
            //     // }
            // }

            await deleteRefreshTokenSession(sessionId);

            // logoutUrl = buildLogoutUrl(session.idToken);
        }
    }

    res.clearCookie("access_token");

    res.clearCookie("refresh_session_id");

    if (logoutUrl) {
        return res.redirect(logoutUrl.toString());
    }

    // return res.sendStatus(204);
    return res.redirect(config.frontend.url);
}

module.exports = {
    login,
    callback,
    logout
};
