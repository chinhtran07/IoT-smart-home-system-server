const authServices = require('../services/auth.services');

const registerUser = async (req, res, next) => {
    try {
        const { username, password, firstName, lastName, email, phone } = req.body;
        const user = await authServices.registerUser(username, password, firstName, lastName, email, phone);

        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;
        delete userWithoutPassword.role;

        res.status(201).json({userWithoutPassword});
    } catch (error) {
        next(error);
    }
}


const loginUser = async (req, res, next) => {

    try {
    const { username, password } = req.body;
    const accessToken = await authServices.loginUser(username, password);
    res.json({ access_token: accessToken});
    } catch (error) {
        next(error);
    }
}

module.exports = { registerUser, loginUser };