const { where } = require('sequelize');
const mongoDb = require('../models/mongo');
const mysqlDb = require('../models/mysql');

const checkDeviceAccess = async (req, res, next) => {
    try {
        const { deviceId } = req.body;

        const device = await mysqlDb.Device.findByPk(deviceId);

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        const access = await mongoDb.AccessControl.findOne({
            userId: req.user._id,
            'permissions.device': deviceId
        });

        if (!access) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = checkDeviceAccess;