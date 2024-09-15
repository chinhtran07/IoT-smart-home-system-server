const gatewayService = require('../services/gateway.services');

const createGateway = async(req, res, next) => {
    try {
        const gatewayData = req.body;
        console.info(gatewayData);
        const gateway = await gatewayService.createGateway(gatewayData, req.user._id);
        res.status(201).json(gateway);
    } catch (error) {
        next(error);
    }
}

const addDevice = async (req, res, next) => {
    try {
        const deviceData = req.body;
        const device = await gatewayService.addDevice(deviceData, req.params.id, req.user._id);
        res.status(201).json(device);
    } catch (error) {
        next(error);
    }
}

const getGatewayById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const gateway = await gatewayService.getGatewayById(id);
        res.status(200).json(gateway);
    } catch (error) {
        next(error);
    }
}

const getGatewaysByUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const gateways = await gatewayService.getGatewayByUser(userId);
        res.status(200).json(gateways);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createGateway,
    addDevice,
    getGatewayById,
    getGatewaysByUser
}