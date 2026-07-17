module.exports = {
    authorize: require("./authorization.middleware").requireRoles,
    authenticate : require("./cookieAuthentication.middleware").requireAuth,
}