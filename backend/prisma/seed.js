const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      name: "Admin",
      description: "System Administrator",
    },
    {
      name: "Employee",
      description: "Regular Employee",
    },
    {
      name: "Support Engineer",
      description: "Handles support tickets",
    },
    {
      name: "Manager",
      description: "Approves requests",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {},

      create: role,
    });
  }
  console.log("Roles seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
