module.exports = {
    requireAuth : require("./authentication.middleware").requireAuth,
    requireRoles: require("./authorization.middleware").requireRoles
}