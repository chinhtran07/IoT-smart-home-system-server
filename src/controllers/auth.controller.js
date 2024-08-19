const authServices = require('../services/auth.services')


const registerUser = async (req, res) => {

    try {
        const { username, password, firstName, lastName, email } = req.body;
        const newUser = await authServices.registerUser( username, password, firstName, lastName, email );
        res.status(201).json({ message: 'User registered', userId: newUser.id });
    } catch (err) {
        res.status(500).json({ error: 'User registration failed', trace: `${err}` });
    }
}


const loginUser = async (req, res) => {

    try {
        const { username, password } = req.body;
        const accessToken = await authServices.loginUser(username, password);
        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
}


module.exports = { registerUser, loginUser }