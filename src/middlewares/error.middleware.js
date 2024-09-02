const errorHandler = (err, req, res, next) => {
    console.log(err.stack);

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;