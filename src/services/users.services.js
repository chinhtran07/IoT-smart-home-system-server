const User = require("../models/User")

const getCurrentUser = async (userId) => {
    const user = User.findByPk(userId, {
        attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'role']
    });

    if (!user) {
        throw new Error('UserNotFound');
    }

    return user;
};


module.exports = {getCurrentUser};