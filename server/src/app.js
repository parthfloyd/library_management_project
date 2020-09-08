const express = require('express');
require('../database/sequelize');
const authRouter = require('../routers/auth');
const bookRouter = require('../routers/book_routes')
const userRouter = require('../routers/user_routes')

const app = express();

app.use(express.json()); // By adding this -express automatically parse json data for us
app.use(authRouter); //Adding Authentication Routes
app.use(bookRouter); //Adding Book Data Manipulation Routes
app.use(userRouter); //Adding User Routes

module.exports = app;