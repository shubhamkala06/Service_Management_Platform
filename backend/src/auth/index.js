module.exports = {
    initialize: require("./client").initialize,
    getConfiguration: require("./client").getConfiguration,

    beginLogin: require("./services/login").buildAuthorizationRequest,
    authenticate: require("./services/callback").exchangeAuthorizationCode,

    validateAccessToken : require("./services/jwt").validateAccessToken,

    getRefreshTokenSession : require("./services/refreshToken").getRefreshTokenSession,
    saveRefreshTokenSession : require("./services/refreshToken").saveRefreshTokenSession,
    deleteRefreshTokenSession : require("./services/refreshToken").deleteRefreshTokenSession,
    
    refreshAccessToken : require("./services/refresh").refreshAccessToken,
};