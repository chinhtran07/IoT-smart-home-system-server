const Gateway = require('../models/Gateway');
const Device = require('../models/Device');
const Actuator = require('../models/Actuator');
const Sensor = require('../models/Sensor');

const createGateway = async (gatewayData, userId) => {
    try {
        const { name, macAddress, ipAddress, status} = gatewayData;
        const newGateway = new Gateway({
            name,
            ipAddress,
            macAddress,
            status,
            userId
        });

        await newGateway.save();

        return newGateway;
    } catch (error) {
        throw new Error(error.message);
    }
}

const addDevice = async (deviceData, gatewayId, userId) => {
    try {
        const gateway = await Gateway.findById(gatewayId);
        if (!gateway)
            throw new CustomError('Not Found', 404);


        const { type, name, macAddress, topics, detail, statusDevice } = deviceData;
        if (!["actuator", "sensor"].includes(type)) {
            const error = new Error('Invalid device type');
            error.status = 400;
            throw error;
        }

        const newDevice = new Device({
            userId,
            name,
            type,
            gatewayId,
            statusDevice,
            macAddress,
            topics,
        });

        await newDevice.save();

        if (type === "actuator") {
            const { type, ...others } = detail;
            const actuator = new Actuator({
                device: newDevice._id,
                type: type,
                properties: others
            });
            await actuator.save();
        } else if (type === "sensor") {
            const sensor = new Sensor({
                deviceId: newDevice._id,
                ...detail
            });
            await sensor.save();
        }

        gateway.devices.push(newDevice._id);
        
        return newDevice;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getGatewayById = async (id) => {
    try {
        const gateway = await Gateway.findById(id).select('-devices');
        if (!gateway) {
            const error = new Error('Not found');
            error.status = 404;
            throw error;
        }

        return gateway;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getGatewayByUser = async (userId) => {
    try {
        const gateway = await Gateway.findOne({ userId: userId });
        if (!gateway) {
            let error = new Error();
            error.status = 404;
            throw error;
        }

        return gateway;
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    createGateway,
    addDevice,
    getGatewayById,
    getGatewayByUser
}