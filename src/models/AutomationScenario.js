const mongoose = require('mongoose');

const automationScenario = new mongoose.Schema({
    name: { Type: String, required: true },
    user: { Type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    triggers: [{ Type: mongoose.Schema.Types.ObjectId, ref: 'Trigger' }],
    conditions: [{ Type: mongoose.Schema.Types.ObjectId, ref: 'Condition' }],
    actions: [{ Type: mongoose.Schema.Types.ObjectId, ref: 'Action' }],
    enabled: { Type: Boolean, default: true }
});

const AutomationScenario = mongoose.model('AutomationScenario', automationScenario);

module.exports = AutomationScenario;