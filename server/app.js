const express = require("express");
const cors = require("cors");
const usersRouter = require("");
const middleware = require("./utils/middleware");

const app = express();
app.use(cors());

app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
