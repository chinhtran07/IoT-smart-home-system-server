const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();

//secure
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/api/auth', require('./routes/auth.routes'));

//middleware
app.use(authMiddleware.authenticate);

//routes


//error handler middleware
app.use(require('./middlewares/error.middleware'));

module.exports = app;