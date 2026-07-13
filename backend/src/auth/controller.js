const userService = require("../user");
const { buildAuthorizationRequest } = require("./services/login");
const { exchangeAuthorizationCode } = require("./services/callback");

const {
    storeLoginState,
    readLoginState,
    clearLoginState,
} = require("./loginState");

const { AppError } = require("../errors");
const {logger} = require("../logger");

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
    userInfo = {
        oidcSubject: identity.userInfo.sub,
        email:identity.userInfo.email,
        firstName:identity.userInfo.first_name,
        lastName:identity.userInfo.last_name,
        displayName:identity.userInfo.name,
        department:identity.userInfo.department,
        phoneNumber:identity.userInfo.phone_number ? String(identity.userInfo.phone_number): null,
        dateOfJoining:new Date(identity.userInfo.date_of_joining),
    }

    user = await userService.createUser(userInfo);

    res.json(user);
}

module.exports = {
    login,
    callback,
};