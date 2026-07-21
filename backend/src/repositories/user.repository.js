const prisma = require("../config/prisma");

/**
 * Find user by email
 */
async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
}

/**
 * Find user by id
 */
async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
}

/**
 * Create new user
 */
async function createUser(userData) {
  return await prisma.user.create({
    data: userData,
    include: { role: true },
  });
}

/**
 * Update user
 */
async function updateUser(id, userData) {
  return await prisma.user.update({
    where: { id },
    data: userData,
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
};
