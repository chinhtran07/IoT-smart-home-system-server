const express = require('express');
const morgan = require('morgan');   

const app = express();

//Middleware
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use(require('./routes/index'));

//Error handle middleware

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});


module.exports = app;