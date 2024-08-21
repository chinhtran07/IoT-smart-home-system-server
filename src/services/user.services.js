const User = require('../models/User');

const getProfile = async(userId) => {
    const user = await User.findById(userId);
    return user;
};

module.exports = {getProfile};