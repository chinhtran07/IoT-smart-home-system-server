const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'AutomationScenario'},
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    type: { type: String, enum: ['modify', 'control'], required: true, default: 'control' },
    property: {type: String, default: 'control'},
    value: { type: mongoose.Schema.Types.Mixed, required: true }
});

const Action = mongoose.model("Action", actionSchema);

module.exports = Action;