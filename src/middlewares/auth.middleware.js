const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (token == null)
        throw new CustomError('Missing token', 401);
    try {
        jwt.verify(token, config.jwt.secret, async (err, user) => {
            if (err) throw new CustomError('Invalid token', 403);
            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
}

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError('Forbidden', 403);
        }
        next();
    };
};

module.exports = {authenticate, authorize};