const mongoose = require('mongoose');

const automationScenarioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    triggers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trigger' }],
    conditions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Condition' }],
    actions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action' }],
    enabled: { type: Boolean, default: true }
});

const AutomationScenario = mongoose.model('AutomationScenario', automationScenarioSchema);

module.exports = AutomationScenario;