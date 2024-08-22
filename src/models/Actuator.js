const mongoose = require('mongoose');

const actuatorSchema = new mongoose.Schema({
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        require: ''
    },
    status: {
        type: Boolean,
        default: false
    }
});

const Actuator = mongoose.model('Actuator', actuatorSchema);

module.exports = Actuator;