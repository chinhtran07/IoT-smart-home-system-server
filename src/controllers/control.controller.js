const controlService = require('../services/control.service');

const controlDevice = async(req, res, next) => {
    try {
        const deviceId = req.body.deviceId;
        const command = req.body.command;
        await controlService.controlDevice(deviceId, command);
        res.status(204);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    controlDevice
}