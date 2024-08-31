const gatewayService = require('../services/gateway.services');

const createGateway = async (res, req, next) => {
    try {
        const gatewayData = req.body;
        const gateway = await gatewayService.createGateway(gatewayData);
        res.json(gateway).status(201);
    } catch (error) {
        next(error);
    }
}

const addDevice = async (res, req, next) => {
    try {
        const deviceData = { ...req.body, ...req.user._id };
        const device = await gatewayService.addDevice(deviceData, req.params.gatewayId);
        res.json(device).status(201);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    createGateway,
    addDevice
}