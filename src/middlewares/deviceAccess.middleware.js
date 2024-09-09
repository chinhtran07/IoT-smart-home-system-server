const AccessControl = require('../models/AccessControl');

const checkDeviceAccess = async (req, res, next) => {
    try {
        const { deviceId } = req.body;

        const device = await findOne({ userId: req.user._id });

        if (device)
            next();

        const access = await AccessControl.findOne({
            userId: req.user._id,
            deviceId: deviceId
        });

        if (!access) return res.sendStatus(403);
        req.access = access;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = checkDeviceAccess;