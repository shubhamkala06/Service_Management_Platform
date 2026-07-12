module.exports = {
    initialize: require("./client").initialize,
    getConfiguration: require("./client").getConfiguration,
    authRoutes: require("./routes")
};