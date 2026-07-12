const prisma = require("./prisma");
const redis = require("./redis");
const { logger } = require("../logger");

async function initialize() {
  await prisma.$connect();
  logger.info("Connected to PostgreSQL.");

  await redis.connect();
  logger.info("Connected to Redis.");
}

async function shutdown() {
  await prisma.$disconnect();
  logger.info("Disconnected from PostgreSQL.");

  await redis.quit();
  logger.info("Disconnected from Redis.");
}

module.exports = {
  initialize,
  shutdown,
  prisma,
  redis,
};