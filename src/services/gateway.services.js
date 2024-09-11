const mysqlDB = require('../models/mysql');
const mongoDb = require('../models/mongo');

const createGateway = async (gatewayData, userId) => {
    try {
        const { name, macAddress, ipAddress, status } = gatewayData;

        const newGateway = await mysqlDB.Gateway.create({
            name,
            ipAddress,
            macAddress,
            status,
            userId
        });

        return newGateway;
    } catch (error) {
        throw new Error(error.message);
    }
};

const addDevice = async (deviceData, gatewayId, userId) => {
    try {
        const gateway = await mysqlDB.Gateway.findByPk(gatewayId);
        if (!gateway) {
            throw new Error('Gateway not found');
        }

        const { type, name, macAddress, topics, detail, status } = deviceData;
        if (!["actuator", "sensor"].includes(type)) {
            throw new Error('Invalid device type');
        }

        const existingDevice = await mysqlDB.Device.findOne({ where: { macAddress } });
        if (existingDevice) {
            throw new Error('Device with this MAC address already exists');
        }

        const newDevice = await mysqlDB.Device.create({
            userId,
            name,
            type,
            gatewayId,
            status,
            macAddress,
        });

        if (type === "actuator") {
            const { type, ...others } = detail;
            await Actuator.create({
                type,
                properties: others
            });
        } else if (type === "sensor") {
            await Sensor.create({
                ...detail
            });
        }

        const topic = new mongoDb.Topic({
            deviceId: newDevice.id,
            topics: topics
        })

        await topic.save();

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