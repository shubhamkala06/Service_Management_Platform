const { buildAuthorizationRequest } = require("./services/login");
const { exchangeAuthorizationCode } = require("./services/callback");

const {
    storeLoginState,
    readLoginState,
    clearLoginState,
} = require("./loginState");

const { AppError } = require("../errors");

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

    const {
        tokenSet,
        claims,
        userInfo,
    } = await exchangeAuthorizationCode({
        currentUrl,
        loginState,
    });

    clearLoginState(res);

    res.json({
        tokenSet,
        claims,
        userInfo,
    });
}

module.exports = {
    login,
    callback,
};