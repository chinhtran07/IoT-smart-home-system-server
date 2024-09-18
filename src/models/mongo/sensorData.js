const mongoose = require('mongoose');

module.exports = (mongoose) => {
    const sensorDataScheme = new mongoose.Schema({
        deviceId: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: Number,
            required: true
        }
    }, {
        timeseries: true
    });

    const SensorData = mongoose.model('SensorData', sensorDataScheme);

    return SensorData;
}

