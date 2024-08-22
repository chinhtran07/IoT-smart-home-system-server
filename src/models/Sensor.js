const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    deviceId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Device',
        required: true,
    },
    unit: {
        type: String, 
        required: true,
    }
});

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;