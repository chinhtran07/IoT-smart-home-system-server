const AccessControl = require("../models/AccessControl");
const CustomError = require("../utils/CustomError");


const createAccessControl = async (userId, permissions) => {
    try {
        const accessControl = new AccessControl({
            userId,
            permissions,
        });

        await accessControl.save();
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAccessControlByUserId = async (userId) => {
    try {
        const accessControls = await AccessControl.findOne({ userId })
            .populate('userId')
            .populate('permissions.device')
            .populate('permissions.group');
        
        if (!accessControls) {
            throw new CustomError('Not Found', 404);
        }
        return accessControls;
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateAccessControl = async (userId, permissions) => {
    try {
        const updatedAccessControl = await AccessControl.findOneAndUpdate(
            { userId },
            { permissions },
            { new: true, runValidators: true }
          ).populate('userId').populate('permissions.device').populate('permissions.group');
          
          if (!updatedAccessControl) {
              throw new CustomError('Not Found', 404);
          }
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    createAccessControl,
    getAccessControlByUserId,
    updateAccessControl
}