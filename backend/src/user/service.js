const { AppError } = require("../errors");
const { logger } = require("../logger");
const repository = require("./repository");

async function provisionUser(userInfo) {
    const existingUser = await repository.findByOidcSubject(
        userInfo.oidcSubject
    );

    const synchronizeIdentity = {
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        department: userInfo.department,
        dateOfJoining: new Date(userInfo.dateOfJoining),
        lastLoginAt: new Date(),
    };

    if (existingUser) {
        const updatedUser = await repository.synchronizeIdentity(
            existingUser.id,
            synchronizeIdentity
        );

        logger.info(
            {
                userId: updatedUser.id,
                email: updatedUser.email,
            },
            "Synchronized existing user."
        );

        return updatedUser;
    }

    const employeeRole = await repository.findRoleByName("Employee");

    if (!employeeRole || !employeeRole.isActive) {
        throw new AppError(
            "Default Employee role is not configured.",
            500
        );
    }

    const newUser = await repository.create({
        oidcSubject: userInfo.oidcSubject,
        ...synchronizeIdentity,
        roleId: employeeRole.id,
        isActive: true,
    });

    logger.info(
        {
            userId: newUser.id,
            email: newUser.email,
        },
        "Provisioned new user."
    );

    return newUser;
}

async function getUserByOidcSubject(oidcSubject) {
    return repository.findByOidcSubject(oidcSubject);
}

async function getCurrentUser(userId) {
    return repository.findById(userId);
}

async function listUsers() {
    return repository.findAll();
}

async function listRoles() {
    return repository.findAllRoles();
}

async function getUserById(userId) {
    const user = await repository.findById(userId);

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    return user;
}

async function updateUserRole(userId, roleName) {
    const user = await repository.findById(userId);

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    const role = await repository.findRoleByName(roleName);

    if (!role) {
        throw new AppError("Role not found.", 404);
    }

    if (!role.isActive) {
        throw new AppError("Role is inactive.", 400);
    }

    if (user.role.id === role.id) {
        return;
    }

    await repository.updateRole(userId, role.id);

    logger.info(
        {
            userId,
            previousRole: user.role.name,
            newRole: role.name,
        },
        "Updated user role."
    );
}

async function updateUserStatus(userId, isActive) {
    const user = await repository.findById(userId);

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    if (user.isActive === isActive) {
        return;
    }

    await repository.updateStatus(userId, isActive);

    logger.info(
        {
            userId,
            previousStatus: user.isActive,
            newStatus: isActive,
        },
        "Updated user application status."
    );
}

module.exports = {
    provisionUser,
    getCurrentUser,
    getUserByOidcSubject,
    listUsers,
    listRoles,
    getUserById,
    updateUserRole,
    updateUserStatus,
};