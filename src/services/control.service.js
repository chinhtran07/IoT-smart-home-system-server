const myEmitter = require('../events/eventsEmitter');
const mysqlDb = require('../models/mysql');
const mongoDb = require('../models/mongo');

const controlDevice = async (deviceId, command = {}) => {
    try {
        const actuator = await mysqlDb.Actuator.findOne({
            include: [{
                model: mysqlDb.Device,
                where: { id: deviceId }
            }]
        });

        if (!actuator) {
            const error = new Error("Not Found");
            error.status = 404;
            throw error;
        }

        const properties = actuator.properties || {};
        const invalidKeys = Object.keys(command).filter(key => !(key in properties));

        if (invalidKeys.length > 0) {
            const error = new Error(`Invalid command keys: ${invalidKeys.join(', ')}`);
            error.status = 400; 
            throw error;
        }

        const payload = {
            action: actuator.action,
            ...command
        };

        const gatewayId = actuator.Device.gatewayId;
        const subscriberTopic = await mongoDb.Topic.findOne({ deviceId: deviceId });

        console.log(payload);

        // Emit control event to the gateway via MQTT
        myEmitter.emit('control', { gatewayId, subscriberTopic, payload });

        // Update actuator properties with the new command
        const updatedProperties = { ...properties, ...command };

        const updatedActuator = await mysqlDb.Actuator.update(
            { properties: updatedProperties }, 
            { where: { id: actuator.id }, returning: true }  
        );

        return updatedActuator;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    controlDevice
};
