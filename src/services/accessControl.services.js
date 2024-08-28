const AccessControl = require('../models/AccessControl');

const deleteAccessControlByUserAndDevice = async (userId, deviceId) => {
    return await AccessControl.findOneAndDelete({ userId, deviceId });
}

module.exports = {
    deleteAccessControlByUserAndDevice,
}