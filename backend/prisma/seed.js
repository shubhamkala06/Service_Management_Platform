const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* -------------------------------------------------------------------------- */
/*                                   Roles                                    */
/* -------------------------------------------------------------------------- */

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
    description: "Provides technical support and assists users.",
    isActive: true,
  },
  {
    name: "Manager",
    description: "Approves requests and manages teams.",
    isActive: true,
  },
];

/* -------------------------------------------------------------------------- */
/*                               Support Teams                                */
/* -------------------------------------------------------------------------- */

const supportTeams = [
  {
    name: "IT Support",
    description: "Handles hardware related issues and requests.",
  },
  {
    name: "Infrastructure Team",
    description: "Handles network, VPN and infrastructure.",
  },
  {
    name: "Application Support",
    description: "Handles software and application requests.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Seeders                                   */
/* -------------------------------------------------------------------------- */

async function seedRoles() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles Seeded");
}

async function seedSupportTeams() {
  for (const team of supportTeams) {
    await prisma.supportTeam.upsert({
      where: {
        name: team.name,
      },
      update: {},
      create: team,
    });
  }

  console.log("✅ Support Teams Seeded");
}

async function seedSupportCategories() {
  const itSupport = await prisma.supportTeam.findUnique({
    where: {
      name: "IT Support",
    },
  });

  const infra = await prisma.supportTeam.findUnique({
    where: {
      name: "Infrastructure Team",
    },
  });

  const appSupport = await prisma.supportTeam.findUnique({
    where: {
      name: "Application Support",
    },
  });

  const categories = [
    // -------------------- SUPPORT --------------------

    {
      name: "Hardware Issue",
      description: "Hardware support issues.",
      supportTeamId: itSupport.id,
    },
    {
      name: "Software Issue",
      description: "Software support issues.",
      supportTeamId: appSupport.id,
    },
    {
      name: "Network Issue",
      description: "Network related issues.",
      supportTeamId: infra.id,
    },
    {
      name: "VPN Issue",
      description: "VPN connectivity issues.",
      supportTeamId: infra.id,
    },
    {
      name: "Email Issue",
      description: "Corporate email issues.",
      supportTeamId: appSupport.id,
    },

    // -------------------- REQUEST --------------------

    {
      name: "Hardware",
      description: "Hardware Request",
      supportTeamId: itSupport.id,
    },
    {
      name: "Software",
      description: "Software Request",
      supportTeamId: appSupport.id,
    },
    {
      name: "Other",
      description: "Other Request",
      supportTeamId: itSupport.id,
    },
  ];

  for (const category of categories) {
    await prisma.supportCategory.upsert({
      where: {
        name: category.name,
      },
      update: {},
      create: category,
    });
  }

  console.log("✅ Support Categories Seeded");
}

async function seedSLAPolicies() {
  const categories = await prisma.supportCategory.findMany();

  for (const category of categories) {
    let responseTarget = 30;
    let resolutionTarget = 240;

    switch (category.name) {
      case "Network Issue":
      case "VPN Issue":
      case "Email Issue":
        responseTarget = 15;
        resolutionTarget = 120;
        break;

      case "Hardware":
      case "Software":
      case "Other":
        responseTarget = 60;
        resolutionTarget = 480;
        break;

      default:
        responseTarget = 30;
        resolutionTarget = 240;
    }

    await prisma.slaPolicy.upsert({
      where: {
        supportCategoryId: category.id,
      },
      update: {},

      create: {
        policyName: `${category.name} SLA`,
        responseTarget,
        resolutionTarget,
        supportCategoryId: category.id,
      },
    });
  }

  console.log("✅ SLA Policies Seeded");
}

/* -------------------------------------------------------------------------- */
/*                                    Main                                    */
/* -------------------------------------------------------------------------- */

async function main() {
  console.log("🚀 Seeding Started...\n");

  await seedRoles();

  await seedSupportTeams();

  await seedSupportCategories();

  await seedSLAPolicies();

  console.log("\n🎉 Database Seeding Completed Successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
