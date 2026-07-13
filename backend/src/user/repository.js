const { prisma } = require("../database");

async function findByOidcSubject(oidcSubject) {
    return prisma.user.findUnique({
        where: {
            oidcSubject,
        },
    });
}

async function findRoleByName(name) {
    return prisma.role.findUnique({
        where: {
            name,
        },
    });
}

async function create(userData) {
    return prisma.user.create({
        data: userData,
    });
}

async function update(id, userData) {
    return prisma.user.update({
        where: {
            id,
        },
        data: userData,
    });
}

module.exports = {
    findByOidcSubject,
    findRoleByName,
    create,
    update,
};