const Gateway = require('../models/Gateway');
const Device = require('../models/Device');
const CustomError = require('../utils/CustomError');
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


        const { type, name, macAddress, topics, configuration, detail } = deviceData;
        if (!["actuator", "sensor"].includes(type)) {
            throw new CustomError("Invalid device type", 400);
        }

        const newDevice = new Device({
            userId,
            name,
            type,
            gatewayId,
            macAddress,
            topics,
            configuration
        });

        await newDevice.save();

        if (type === "actuator") {
            const actuator = new Actuator({
                deviceId: newDevice._id,
                ...detail
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


module.exports = {
    createGateway,
    addDevice,
}