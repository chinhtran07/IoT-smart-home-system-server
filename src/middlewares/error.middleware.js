const errorHandler = (err, req, res, next) => {
    // Log lỗi ra console (hoặc sử dụng dịch vụ log)
    console.error(err.stack);

    // Xác định mã lỗi và thông báo
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Trả về lỗi cho client
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

module.exports = errorHandler;
