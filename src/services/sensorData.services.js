const SensorData = require("../models/SensorData");

const createSensorData = async (sensorId, data) => {
    try {
        const newData = new SensorData({
            sensorId,
            value: data
        });

        await newData.save();
    } catch (error) {
        throw new Error(error.message);
    }
}