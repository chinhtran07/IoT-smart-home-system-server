const userService = require('../services/users.services');

const getCurrentUser = async (req, res) => {
    try {
        const user = await userService.getCurrentUser(req.user.id);
        res.json({user});
    } catch (error) {
        if (error.message === "UserNotFound")
            res.status(404).json({message: "User not found"});
        
        res.status(500).json({message: error.message});
    }
}

module.exports = {getCurrentUser}