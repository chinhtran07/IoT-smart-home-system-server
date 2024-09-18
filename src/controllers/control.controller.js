const controlService = require('../services/control.service');

const controlDevice = async(req, res, next) => {
    try {
        const { deviceId, command } = req.body;
        await controlService.controlDevice(deviceId, command);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    controlDevice
}