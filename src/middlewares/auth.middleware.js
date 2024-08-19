const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        jwt.verify(token, config.secret, async (err, user) => {
            if (err) return res.sendStatus(403);

            const dbUser = await User.findByPk(user.id);
            if (!dbUser) return res.sendStatus(404);

            req.user = user;
            next();
        });
    } catch (error) {
        res.status(400).json({message: 'Invalid token'});
    }
}

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message: 'Forbidden'});
        }
        next();
    };
};

module.exports = {authenticateToken, authorize};