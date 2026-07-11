const path = require("path");
const app = require(path.join(__dirname,"/app"));
const {prisma} = require(path.join(__dirname,"/database"))
const config = require(path.join(__dirname,"/config/env"))


async function start() {
    try {
        await prisma.$connect();

        console.log("Connected to PostgreSQL");

        app.listen(config.app.port, () => {
            console.log(`Server running on port ${config.app.port}`);
        });
    } catch (err) {
        console.error("Failed to start application");
        console.error(err);

        process.exit(1);
    }
}

start();