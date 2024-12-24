const express = require("express");
const app = express();
require("dotenv").config();
const cores = require("cors");
app.use(cores());
const PORT = process.env.PORT;
const server = require("http").createServer(app);
const pool = require("./models/db");

app.use(express.json());

server.listen(PORT, () => {
  console.log(`Server Listening At PORT ${PORT}`);
});
