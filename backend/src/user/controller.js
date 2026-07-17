const users = require("./index");

async function getCurrentUser(req, res) {
    const user = await users.getCurrentUser(req.user.id);

    res.status(200).json(user);
}

async function listUsers(req, res) {
    const usersList = await users.listUsers();

    res.status(200).json(usersList);
}

async function getUser(req, res) {
    const user = await users.getUserById(req.params.id);

    res.status(200).json(user);
}

async function updateUserRole(req, res) {
    await users.updateUserRole(
        req.params.id,
        req.body.roleName
    );

    res.sendStatus(204);
}

async function updateUserStatus(req, res) {
    await users.updateUserStatus(
        req.params.id,
        req.body.isActive
    );

    res.sendStatus(204);
}

module.exports = {
    getCurrentUser,
    listUsers,
    getUser,
    updateUserRole,
    updateUserStatus,
};