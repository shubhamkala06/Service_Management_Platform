const users = require("./service");

async function getCurrentUser(req, res) {
    const user = await users.getCurrentUser(req.user.id);

    res.status(200).json(user);
}

async function listUsers(req, res) {
    const usersList = await users.listUsers();

    res.status(200).json(usersList);
}

async function listRoles(req, res) {
    const rolesList = await users.listRoles();

    res.status(200).json(rolesList);
}

async function getUser(req, res) {
    const user = await users.getUserById(req.params.id);

    res.status(200).json(user);
}

async function updateUserRole(req, res) {
    const role = await users.updateUserRole(
        req.params.id,
        req.body.roleName
    );

    res.status(200).json(role);
}

async function updateUserStatus(req, res) {
    const status = await users.updateUserStatus(
        req.params.id,
        req.body.isActive
    );

    res.status(200).json({"isActive":status});
}

module.exports = {
    getCurrentUser,
    listUsers,
    listRoles,
    getUser,
    updateUserRole,
    updateUserStatus,
};