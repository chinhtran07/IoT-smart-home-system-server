const User = require('../models/User');

const registerUser = async (username, password, firstName, lastName, email, phone) => {
    const newUser = new User({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email
    });
    await newUser.save();

    return newUser;
}

const loginUser = async (username, password) => {
    const user = await User.findOne({username});

    const isMatch = await user.comparePassword(password);
    if (!user || !isMatch)
        throw new CustomError('Invalid username or password', 400);

    const token = user.generateAuthToken();

    return token;
}

module.exports = {registerUser, loginUser};