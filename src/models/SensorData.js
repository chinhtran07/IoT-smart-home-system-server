const mongoose = require('mongoose');

const sensorDataScheme = new mongoose.Schema({
    deviceId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Sensor',
        required: true,
    },
    value: {
        type: Number,
        required: true
    }
}, {
    timeseries: true
});

const SensorData = mongoose.model('SensorData', sensorDataScheme);

module.exports = SensorData;