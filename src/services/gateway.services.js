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
    const transaction = await mysqlDB.sequelize.transaction();
    try {
        const gateway = await mysqlDB.Gateway.findByPk(gatewayId, { transaction });
        if (!gateway) {
            throw new Error('Gateway not found');
        }

        const { type, name, macAddress, topics, detail, status } = deviceData;
        if (!["actuator", "sensor"].includes(type)) {
            throw new Error('Invalid device type');
        }

        const existingDevice = await mysqlDB.Device.findOne({ where: { macAddress }, transaction });
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
        }, { transaction });

        if (type === "actuator") {
            const { type: actuatorType, ...others } = detail;
            await mysqlDB.Actuator.create({
                type: actuatorType,
                properties: others,
                id: newDevice.id
            }, { transaction });
        } else if (type === "sensor") {
            await mysqlDB.Sensor.create({
                ...detail,
                id: newDevice.id
            }, { transaction });
        }

        const topic = new mongoDb.Topic({
            deviceId: newDevice.id,
            topics: topics
        });

        await topic.save();

        await transaction.commit();
        return newDevice;
    } catch (error) {
        await transaction.rollback();
        throw new Error(error.message);
    }
}

const getGatewayById = async (id) => {
    try {
        const gateway = await mysqlDB.Gateway.findByPk(id, {
            attributes: ['id', 'name', 'status']
        });
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
        const gateways = await mysqlDB.Gateway.findOne({ userId: userId }, {
            attributes: ['id', 'name', 'status']
        });
        if (!gateways) {
            let error = new Error();
            error.status = 404;
            throw error;
        }

        return gateways;
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