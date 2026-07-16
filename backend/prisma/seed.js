const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  /* ==========================
     Seed Roles
  ========================== */

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

  console.log("✅ Roles seeded successfully.");

  /* ==========================
     Seed Support Teams
  ========================== */

  const supportTeams = [
    {
      name: "Hardware Team",
      description: "Handles hardware related tickets",
    },
    {
      name: "Software Team",
      description: "Handles software related tickets",
    },
    {
      name: "Network Team",
      description: "Handles network related tickets",
    },
  ];

  for (const team of supportTeams) {
    await prisma.supportTeam.upsert({
      where: {
        name: team.name,
      },
      update: {},
      create: team,
    });
  }

  console.log("✅ Support Teams seeded successfully.");

  /* ==========================
     Fetch Teams
  ========================== */

  const hardwareTeam = await prisma.supportTeam.findUnique({
    where: {
      name: "Hardware Team",
    },
  });

  const softwareTeam = await prisma.supportTeam.findUnique({
    where: {
      name: "Software Team",
    },
  });

  const networkTeam = await prisma.supportTeam.findUnique({
    where: {
      name: "Network Team",
    },
  });

  /* ==========================
     Seed Support Categories
  ========================== */

  const categories = [
    {
      name: "Laptop Issue",
      supportTeamId: hardwareTeam.id,
    },
    {
      name: "Desktop Issue",
      supportTeamId: hardwareTeam.id,
    },
    {
      name: "Printer Issue",
      supportTeamId: hardwareTeam.id,
    },
    {
      name: "Software Installation",
      supportTeamId: softwareTeam.id,
    },
    {
      name: "Application Error",
      supportTeamId: softwareTeam.id,
    },
    {
      name: "Email Issue",
      supportTeamId: softwareTeam.id,
    },
    {
      name: "VPN Issue",
      supportTeamId: networkTeam.id,
    },
    {
      name: "Internet Issue",
      supportTeamId: networkTeam.id,
    },
  ];

  for (const category of categories) {
    await prisma.supportCategory.upsert({
      where: {
        name: category.name,
      },
      update: {
        supportTeamId: category.supportTeamId,
      },
      create: category,
    });
  }

  console.log("✅ Support Categories seeded successfully.");

  console.log("\n🎉 Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
