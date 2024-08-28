const mongoose = require('mongoose');

const deviceGroupSchema = new mongoose.Schema({
    deviceId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Device',
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Group',
        required: true
    }
}, {
    timestamps: true
});

const DeviceGroup = mongoose.model('DeviceGroup', deviceGroupSchema);

module.exports = DeviceGroup;