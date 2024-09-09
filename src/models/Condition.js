const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
    scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'AutomationScenario', required: true },
    type: { type: String, enum: ['time', 'device', 'sensor'], required: true},
    startTime: { type: String },
    endTime: {type: String},
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    comparator: {type: String},
    deviceStatus: { type: String}
});

const Condition = mongoose.model('Condition', conditionSchema);

module.exports = Condition;