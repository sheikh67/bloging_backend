const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const todoRouter = require('./routers/todo.router');
const userRouter = require('./routers/user.router');

require("dotenv").config();
require('./db/db.config');

app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1', todoRouter);
app.use('/api/v1', userRouter);


module.exports = app;