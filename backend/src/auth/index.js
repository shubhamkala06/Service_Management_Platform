const client = require("./client");
const login = require("./services/login");
const callback = require("./services/callback");

module.exports = {
    initialize: client.initialize,
    getConfiguration: client.getConfiguration,

    beginLogin: login.buildAuthorizationRequest,
    authenticate: callback.exchangeAuthorizationCode,

    authRoutes: require("./routes"),

    verifyJWT: require("./services/jwt").verify
};