const authServices = require('../services/auth.services');

const registerUser = async (req, res, next) => {
    try {
        const { username, password, firstName, lastName, email, phone } = req.body;
        await authServices.registerUser(username, password, firstName, lastName, email, phone);
        res.status(201);
    } catch (error) {
        next(error);
    }
}


const loginUser = async (req, res, next) => {

    try {
    const { username, password } = req.body;
    const accessToken = await authServices.loginUser(username, password);
    res.json({ accessToken });
    } catch (error) {
        next(error);
    }
}

module.exports = { registerUser, loginUser };