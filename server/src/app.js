const express = require('express');
require('../database/sequelize');
const userRouter = require('../routers/user');

const app = express();

app.use(express.json()); // By adding this -express automatically parse json data for us
app.use(userRouter); //Adding user Routes

module.exports = app;