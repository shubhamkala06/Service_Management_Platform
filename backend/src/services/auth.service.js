const {
  findUserByEmail,
  createUser,
} = require("../repositories/user.repository");

const { findRoleByName } = require("../repositories/role.repository");

const { hashPassword } = require("../utils/password.util");
const AppError = require("../errors/app-error");
const { generateToken } = require("../utils/jwt.util");
const { comparePassword } = require("../utils/password.util");
const HTTP_STATUS = require("../constants/http-status");

/**
 * Register System Administrator
 */
async function registerAdmin(userData) {
  const existingUser = await findUserByEmail(userData.email);

  if (existingUser) {
    throw new AppError("Email already exists", HTTP_STATUS.CONFLICT);
  }

  // const adminRole = await findRoleByName("Admin");

  // if (!adminRole) {
  //   throw new AppError("Admin role not found.", HTTP_STATUS.NOT_FOUND);
  // }

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
/**
 * Login User
 */
async function login(credentials) {
  const user = await findUserByEmail(credentials.email);

  if (!user) {
    throw new AppError("Invalid email or password.", HTTP_STATUS.UNAUTHORIZED);
  }

  const passwordMatched = await comparePassword(
    credentials.password,
    user.password,
  );

  if (!passwordMatched) {
    throw new AppError("Invalid email or password.", HTTP_STATUS.UNAUTHORIZED);
  }

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
  login,
};
