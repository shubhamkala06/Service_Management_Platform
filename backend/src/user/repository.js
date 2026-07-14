const { prisma } = require("../database");

async function findByOidcSubject(oidcSubject) {
    return prisma.user.findUnique({
        where: {
            oidcSubject,
        },
    });
}

async function findById(id) {
    return prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            department: true,
            isActive: true,
            role: true,
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
    findById,
    create,
    update,
};