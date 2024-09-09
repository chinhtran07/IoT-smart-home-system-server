const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    scenario: { Type: mongoose.Schema.Types.ObjectId, ref: 'AutomationScenario', required: true },
    device: { Type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    type: { Type: String, enum: ['modify', 'control'], required: true, default: 'control' },
    property: {Type: String, default: 'control'},
    value: { Type: mongoose.Schema.Types.Mixed, required: true }
});

const Action = mongoose.model("Action", actionSchema);

module.exports = Action;