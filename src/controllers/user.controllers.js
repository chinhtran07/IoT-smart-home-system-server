const userServices = require('../services/user.services');

const getProfile = async(req, res, next) => {
    try {
        const user = await userServices.getProfile(req.userId);
        if (!user)
            next(new CustomError('User not found', 404));
        res.json({
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        })
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async(req, res, next) => {
    try {
        const user = await userServices.getProfile(req.user._id);
        res.json({
            id: user._id,
            firstName: user.firstName, 
            lastName: user.lastName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {getProfile, getCurrentUser};