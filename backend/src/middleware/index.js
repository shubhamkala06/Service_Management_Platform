module.exports = {
  // requireAuth : require("./authentication.middleware").requireAuth,
  authorize: require("./authorization.middleware").requireRoles,
  authenticate: require("./cookieAuthentication.middleware").authenticate,
};
