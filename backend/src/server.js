const app = require("./app");

const config = require("./config/env");
const auth = require("./auth");
const {prisma, redis} = require("./database");
const {logger} = require("./logger");

let server = null;
async function bootstrap() {
    try {
        await prisma.$connect();
        logger.info("Connected to PostgreSQL.");
        await redis.connect();
        logger.info("Connected to Redis.");
        await auth.initialize()
        server = app.listen(config.app.port, () => {
            logger.info(
                { port: config.app.port },
                "HTTP server started."
            );
        });
    } catch (err) {
        logger.error(
            { err },
            "Application startup failed."
        );

        process.exit(1);
    }
}

let shuttingDown = false;

async function shutdown() {
    if (shuttingDown) return;
    let code = 0;
    shuttingDown = true;

    logger.info("Application shutting down")

    try {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }

        if (redis.isOpen) {
            await redis.quit();
        }

        await prisma.$disconnect();
    } catch (err) {
        logger.error(
            { err },
            "Application shutdown failed."
        );
        code = 1
    } finally {
        process.exit(code);
    }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

bootstrap();