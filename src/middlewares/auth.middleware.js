const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, config.secret, async (err, user) => {
        if (err) return res.sendStatus(403);

        const dbUser = await User.findByPk(user.id);
        if(!dbUser) return res.sendStatus(404);

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;