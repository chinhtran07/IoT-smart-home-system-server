const Actuator = require('../models/Actuator');
const myEmitter = require('../events/eventsEmitter');

const controlDevice = async (deviceId, command={}) => {
    try {
        const actuator = await Actuator.findOne({ device: deviceId }).populate('device');
        if (!actuator) {
            const error = new Error("Not Found");
            error.status = 404;
            throw error;
        }

        
        const invalidKeys = Object.keys(command).filter(key => !(key in properties));

        if (invalidKeys.length > 0) {
            const error = new Error(`Invalid command keys: ${invalidKeys.join(', ')}`);
            error.status = 400; // Bad Request
            throw error;
        }


        const payload = {
            action: actuator.action,
            ...command
        }
        
        const gatewayId = await actuator.device.gatewayId;
        const topic = await actuator.device.topics.subscriber[0];

        console.log(payload);

        myEmitter.emit('control', { gatewayId, topic, payload });

        const updatedProperties = { ...properties, ...command }; // Gộp properties cũ và command mới

        const updatedActuator = await Actuator.findOneAndUpdate(
            { device: deviceId },
            { properties: updatedProperties },  // Cập nhật các thuộc tính mới
            { new: true }  // Trả về tài liệu đã cập nhật
        );


    } catch (error) {
        throw error;
    }
}

module.exports = {
    controlDevice
}