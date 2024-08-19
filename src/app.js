require('dotenv').config();
const express = require('express');
const morgan = require('morgan');  
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const passport = require('passport');
const createError = require('http-errors');
const {check, validationResult} = require('express-validator');


const app = express();

//Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//Session


//Routes
app.use('/api/auth' ,require('./routes/auth.routes'));  


//Error handle middleware

// app.use(require('./middlewares/error.middleware'));

module.exports = app;