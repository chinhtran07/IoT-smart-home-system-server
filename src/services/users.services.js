const db = require('../models');

const getCurrentUser = async (userId) => {
    const user = await db.User.findByPk(userId, {
        attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'role']
    });

    if (!user) {
        throw new Error('UserNotFound');
    }

    return user;
};


module.exports = {getCurrentUser};