const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const roles = [
  {
    name: "Employee",
    description: "Standard employee with access to the application.",
    isActive: true,
  },
  {
    name: "System Administrator",
    description: "Full access to manage users, roles, and system settings.",
    isActive: true,
  },
  {
    name: "Support Engineer",
    description: "Provides technical support and assists users with system issues.",
    isActive: true,
  },
  {
    name: "Manager",
    description: "Manages employees, teams, and operational workflows.",
    isActive: true,
  },
];

async function seedRoles() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {},
      create: role,
    });

    console.log("Seeding completed");
  }
}

async function main() {
  await seedRoles();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });