const app = require("./app");

const config = require("./config/env");
const auth = require("./auth");
const database = require("./database");
const { logger } = require("./logger");

let server = null;
let shuttingDown = false;

async function bootstrap() {
  try {
    await database.initialize();
    await auth.initialize();

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

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  let exitCode = 0;

  logger.info(
    { signal },
    "Shutting down application."
  );

  try {
    // Stop accepting new connections.
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    // Shut down application resources.
    await database.shutdown();
  } catch (err) {
    logger.error(
      { err },
      "Error during shutdown."
    );

    exitCode = 1;
  } finally {
    process.exit(exitCode);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

bootstrap();