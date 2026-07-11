const app = require("./app");
const {prisma, redis} = require("./database")
const config = require("./config/env")

let server = null;
async function bootstrap() {
    try {
        await prisma.$connect();
        await redis.connect();
        console.log("Connected to PostgreSQL");
        console.log("Connected to Redis");
        server = app.listen(config.app.port, () => {
            console.log(`Server running on port ${config.app.port}`);
        });
    } catch (err) {
        console.error("Failed to start application");
        console.error(err);

        process.exit(1);
    }
}

let shuttingDown = false;

async function shutdown() {
    if (shuttingDown) return;
    let code = 0;
    shuttingDown = true;

    console.log("Shutting down gracefully");

    try {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }

        if (redis.isOpen) {
            await redis.quit();
        }

        await prisma.$disconnect();
    } catch (err) {
        console.error(err);
        code = 1
    } finally {
        process.exit(code);
    }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

bootstrap();