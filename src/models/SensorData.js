const mongoose = require('mongoose');

const sensorDataScheme = new mongoose.Schema({
    sensorId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Sensor',
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