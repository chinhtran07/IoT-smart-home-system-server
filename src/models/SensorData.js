const mongoose = require('mongoose');

const sensorDataScheme = new mongoose.Schema({
    deviceId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Device',
        required: true,
    },
    value: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SensorData = mongoose.Model('SensorData', sensorDataScheme);

module.exports = SensorData;