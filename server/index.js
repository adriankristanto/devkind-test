const app = require("./app");
const logger = require("./utils/logger");
const http = require("http");
const config = require("./utils/config");

const server = http.createServer(app);

server.listen(config.PORT || 3001, () => {
  logger.debug(`Server running on port ${config.PORT}`);
});
