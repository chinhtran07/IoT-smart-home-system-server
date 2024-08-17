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
const authenticateToken = require('./middlewares/auth.middleware');

const app = express();

//Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//Session


//Routes
app.use('/api/user' ,require('./routes/auth'));

// app.get('/api/protected', authenticateToken, (req, res) => {
//     res.json({message: 'This is a protected route', user: req.user});
// });


//Error handle middleware

// app.use(require('./middlewares/error.middleware'));

module.exports = app;