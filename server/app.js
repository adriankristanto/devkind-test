const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

module.exports = app;
