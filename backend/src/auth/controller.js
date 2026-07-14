const userService = require("../user");
const { buildAuthorizationRequest } = require("./services/login");
const { exchangeAuthorizationCode } = require("./services/callback");
const jwt = require("./services/jwt")

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
        oidcSubject: identity.claims.sub,
        email:identity.claims.email,
        firstName:identity.claims.first_name,
        lastName:identity.claims.last_name,
        department:identity.claims.department,
        dateOfJoining:new Date(identity.claims.date_of_joining),
    }

    user = await userService.createUser(userInfo);

    
    access_token = identity.tokenSet.access_token;
    console.log(access_token);
    res.cookie("access_token", access_token, {          //non pop-up
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    
    res.json(user);
    // res.redirect("http://localhost:5173/");
}

module.exports = {
    login,
    callback,
};