const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const todoRouter = require("./routers/todo.router");
const userRouter = require("./routers/user.router");
const router = express.Router();

require("dotenv").config();
require("./db/db.config");

app.use(cors());
app.use(bodyParser.json());
app.use("/.netlify/functions/app", todoRouter);
app.use("/.netlify/functions/app", userRouter);

router.get("/", (req, res) => {
  res.json({
    hello: "hi!",
  });
});

app.use(`/.netlify/functions/app`, router);

module.exports = app;
module.exports.handler = serverless(app);
