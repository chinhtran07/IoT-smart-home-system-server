const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/jwt')

const registerUser = async (username, password, firstName, lastName, email ) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, firstName, lastName, email });

    return newUser;
};

const loginUser = async (username, password) => {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return new Error('Invalid password');

    user.lastLogin = new Date();
    await user.save();

    const accessToken = jwt.sign({ id: user.id, username: user.username }, config.secret, {
        expiresIn: config.expiresIn,
    });

    return accessToken;
};



module.exports = { registerUser, loginUser};
