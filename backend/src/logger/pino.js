const pino = require("pino");

const config = require("../config/env");


const logger = pino({
    level : config.logger.level || "info",
    transport : 
        config.app.env === "development"
        ?{
            target : "pino-pretty",
            options : {
                colorize : true,
                translateTime : "SYS:standard",
                ignore : "pid,hostname"
            },
        }
        :
        undefined
})

module.exports = logger;