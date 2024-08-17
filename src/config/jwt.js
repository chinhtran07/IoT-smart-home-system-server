const config = require('./config');

module.exports = {
    secret: config.jwtSecret,
    expiresIn: '1h'
}