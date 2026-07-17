const { prisma } = require("../database");

async function findByOidcSubject(oidcSubject) {
  return prisma.user.findUnique({
    where: {
      oidcSubject,
    },
  });
}

async function findUserById(id) {
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
async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
}

async function findRoleByName(name) {
  return prisma.role.findUnique({
    where: {
      name,
    },
  });
}
async function getAllRoles() {
  return await prisma.role.findMany({
    orderBy: {
      id: "asc",
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
  getAllRoles,
  findUserById,
  findUserByEmail,
  create,
  update,
};
