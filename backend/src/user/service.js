const {AppError} = require("../errors");
const {logger} = require("../logger");
const repository = require("./repository");

async function provisionUser(userInfo) {
    const existingUser = await repository.findByOidcSubject(
        userInfo.oidcSubject
    );

    const userData = {
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        department: userInfo.department,
        dateOfJoining: new Date(userInfo.dateOfJoining),
        lastLoginAt: new Date(),
    };

    if (existingUser) {
        const updatedUser = await repository.update(existingUser.id, userData);
        logger.info(
            {
                userId: updatedUser.id,
                email: updatedUser.email,
            },
            "Synchronized existing user."
        );
        return updatedUser;
    }


    const employeeRole = await repository.findRoleByName(
        "Employee"
    );
    
    if (!employeeRole || (employeeRole.isActive===false)) {
        throw new AppError("Default Employee role is not configured.",500);
    }

    const newUser = await repository.create({
        oidcSubject: userInfo.oidcSubject,

        ...userData,

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

module.exports = {
    provisionUser,
};