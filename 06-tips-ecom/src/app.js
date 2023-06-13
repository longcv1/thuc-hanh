const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const {countConnection, checkOverload} = require('./libs/libs.check.connection');

//init app using express
const app = express();

//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression())

//init database
require('./db/db.init.mongo');
countConnection();
checkOverload();

//init routers

//handle errors

module.exports = app;