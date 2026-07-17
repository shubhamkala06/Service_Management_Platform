module.exports = {
    initialize: require("./client").initialize,
    getConfiguration: require("./client").getConfiguration,

    beginLogin: require("./services/login").buildAuthorizationRequest,
    authenticate: require("./services/callback").exchangeAuthorizationCode,

    verifyJWT: require("./services/jwt").validateAccessToken
};