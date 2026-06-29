const {
  findUserByEmail,
  createUser,
} = require("../repositories/user.repository");

const { findRoleByName } = require("../repositories/role.repository");

const { hashPassword } = require("../utils/password.util");

const { generateToken } = require("../utils/jwt.util");

/**
 * Register System Administrator
 */
async function registerAdmin(userData) {
  const existingUser = await findUserByEmail(userData.email);

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const adminRole = await findRoleByName("Admin");

  if (!adminRole) {
    throw new Error("Admin role not found.");
  }

  const hashedPassword = await hashPassword(userData.password);

  const user = await createUser({
    firstName: userData.firstName,

    lastName: userData.lastName,

    email: userData.email,

    password: hashedPassword,

    department: userData.department,

    roleId: adminRole.id,
  });

  const token = generateToken({
    id: user.id,

    email: user.email,

    role: user.role.name,
  });

  return {
    user,

    token,
  };
}

module.exports = {
  registerAdmin,
};
