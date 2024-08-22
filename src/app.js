const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const authMiddleware = require('./middlewares/auth.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('swagger-jsdoc');

const app = express();

//secure
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//middleware

//routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', authMiddleware.authenticate ,require('./routes/user.routes'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//error handler middleware
app.use(require('./middlewares/error.middleware'));

module.exports = app;