const mongoDb = require('../models/mongo');
const mysqlDb = require('../models/mysql');

const checkDeviceAccess = async (req, res, next) => {
    try {
        const id = req.params.id || req.body.deviceId;

        const device = await mysqlDb.Device.findByPk(id);

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        if (device.userId === req.user._id) {
            next();
            return;
        }

        const access = await mongoDb.AccessControl.findOne({
            userId: req.user._id,
            'permissions.device': id
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