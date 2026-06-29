const prisma = require("../config/prisma");

/**
 * Find role by name
 */
async function findRoleByName(name) {
  return await prisma.role.findUnique({
    where: {
      name,
    },
  });
}

/**
 * Get all roles
 */
async function getAllRoles() {
  return await prisma.role.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

module.exports = {
  findRoleByName,
  getAllRoles,
};
