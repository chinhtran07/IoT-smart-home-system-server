const myEmitter = require('../events/eventsEmitter');
const mysqlDb = require('../models/mysql');
const mongoDb = require('../models/mongo');

const controlDevice = async (deviceId, command = {}) => {
    try {
        // Kiểm tra actuator và device cùng lúc để giảm truy vấn
        const device = await mysqlDb.Device.findByPk(deviceId, {
            attributes: ['gatewayId']
        });

        const actuator = await mysqlDb.Actuator.findByPk(deviceId);

        if (!device || !actuator) {
            throw createError(404, 'Actuator or Device not found');
        }

        const properties = actuator.properties || {};

        console.log(properties);

        const invalidKeys = Object.keys(command).filter(key => !(key in properties));

        if (invalidKeys.length > 0) {
            throw createError(400, `Invalid command keys: ${invalidKeys.join(', ')}`);
        }

        const topic = await mongoDb.Topic.findOne({ deviceId });
        if (!topic || !topic.topics.subscriber[0]) {
            throw createError(404, 'Topic not found for device');
        }
        const subscriberTopic = topic.topics.subscriber[0];

        const payload = { ...command };
        myEmitter.emit('control', { gatewayId: device.gatewayId, subscriberTopic, payload });

        const updatedProperties = { ...command };
        console.log(updatedProperties);
        if (JSON.stringify(properties) !== JSON.stringify(updatedProperties)) {
            await mysqlDb.Actuator.update(
                { properties: updatedProperties },
                { where: { id: actuator.id } }
            );
        }

        return { status: 'success', updatedProperties };
    } catch (error) {
        throw createError(error.status || 500, error.message);
    }
};

// Hàm tạo lỗi tùy chỉnh
const createError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

module.exports = {
    controlDevice
};
