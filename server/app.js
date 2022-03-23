const express = require("express");
const cors = require("cors");
const usersRouter = require("");

const app = express();
app.use(cors());

app.use("/api/users", usersRouter);

module.exports = app;
