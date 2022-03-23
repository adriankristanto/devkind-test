const logger = require("./logger");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  // call Express' default error handler for unhandled errors
  next(error);
};

const verifyJWT = (request, response, next) => {
  const authorisation = request.get("authorization");
  // the authorization header should start with "bearer"
  const token =
    authorisation && authorisation.split(" ")[0].toLowerCase() === "bearer"
      ? authorisation.split(" ")[1]
      : null;
  const decodedToken = jwt.verify(token, config.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  request.user = {
    id: decodedToken.id,
    email: decodedToken.email,
  };

  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  verifyJWT,
};
