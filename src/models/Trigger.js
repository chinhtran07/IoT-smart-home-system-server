const mongoose = require('mongoose');

const triggerSchema = new mongoose.Schema({
    rule: { type: mongoose.Schema.Types.ObjectId, ref: 'AutomationScenario', required: true },
    type: { type: String, enum: ['time', 'device', 'sensor'], required: true },
    startTime: { type: String },
    endTime: {type: String},
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    comparator: {type: String},
    deviceStatus: { type: String }
});

const Trigger = mongoose.model('Trigger', triggerSchema);

module.exports = Trigger;