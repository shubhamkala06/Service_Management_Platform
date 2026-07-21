module.exports = {
    createUser: require("./service").provisionUser,
    getCurrentUser : require("./service").getCurrentUser,
    getUserByOidcSubject : require("./service").getUserByOidcSubject,
    listUsers : require("./service").listUsers,
    getUserById : require("./service").getUserById,
    updateUserRole : require("./service").updateUserRole,
    updateUserStatus : require("./service").updateUserStatus,
};