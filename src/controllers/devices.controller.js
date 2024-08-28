const deviceService = require('../services/device.services'); 

const getAllDevices = async (req, res, next) => {
    try {
        const devices = await deviceService.getAllDevices();
        res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
}


const getDeviceById = async (req, res, next) => {
    try {
        const { deviceId } = req.body;
        const device = await deviceService.getDeviceById(deviceId);
        res.status(200).json(device);
    } catch (error) {
        next(error);
    }
}

const updateDevice = async (req, res, next) => {
    try {
        const deviceId = res.params.id;
        const deviceData = res.body;
        await deviceService.updateDevice({ id: deviceId, deviceData: deviceData });
        res.status(204);
    } catch (error) {
        next(error);
    }
}

const deleteDevice = async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        await deviceService.deleteDevice(deviceId);
        res.status(204);
    } catch (error) {
        next(error);
    }
}

con

module.exports = {
    
}