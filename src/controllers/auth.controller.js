const authServices = require('../services/auth.services');

const registerUser = async (req, res) => {
    try {
        const {username, password, firstName, lastName, email} = req.body;
        const newUser = await authServices.registerUser(username, password, firstName, lastName, email);
        res.status(201).json({
            id: newUser._id,
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        });
    } catch(error) {
        throw new CustomError();
    }
}


const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        const accessToken = await authServices.loginUser(username, password);
        res.json({accessToken: accessToken});
    } catch (error) {
        throw new CustomError();
    }
}

module.exports = {registerUser, loginUser};