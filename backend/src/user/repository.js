const { prisma } = require("../database");

const userSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    department: true,
    isActive: true,
    role: true,
};

async function findAll() {
    return prisma.user.findMany({
        select: userSelect,
    });
}

async function findById(id) {
    return prisma.user.findUnique({
        where: {
            id,
        },
        select: userSelect,
    });
}

async function findByOidcSubject(oidcSubject) {
    return prisma.user.findUnique({
        where: {
            oidcSubject,
        },
        select: userSelect,
    });
}

async function findAllRoles() {
    return prisma.role.findMany();
}

async function findRoleById(id) {
    return prisma.role.findUnique({
        where: {
            id,
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

async function synchronizeIdentity(id, profileData) {
    return prisma.user.update({
        where: {
            id,
        },
        data: profileData,
    });
}

async function updateRole(id, roleId) {
    return prisma.user.update({
        where: {
            id,
        },
        data: {
            roleId,
        },
    });
}

async function updateStatus(id, isActive) {
    return prisma.user.update({
        where: {
            id,
        },
        data: {
            isActive,
        },
    });
}

module.exports = {
    findAll,
    findById,
    findByOidcSubject,

    findAllRoles,
    findRoleById,
    findRoleByName,

    create,

    synchronizeIdentity,
    updateRole,
    updateStatus,
};