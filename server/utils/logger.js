const config = require("../utils/config");
const { createLogger, transports, format } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.MongoDB({
      level: "info",
      db: config.MONGODB_URI,
      format: format.combine(format.timestamp(), format.json()),
      options: { useUnifiedTopology: true },
      collection: "logs",
    }),
    new transports.MongoDB({
      level: "error",
      db: config.MONGODB_URI,
      format: format.combine(format.timestamp(), format.json()),
      options: { useUnifiedTopology: true },
      collection: "errors",
    }),
  ],
});

module.exports = logger;
