const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trigger: [{ type: String, required: true }],
  action: {
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    action: { type: String, required: true },
    value: mongoose.Schema.Types.Mixed
  },
  enabled: { type: Boolean, default: true },
}, {
  timestamps: true
});

const AutomationRule = mongoose.model('AutomationRule', automationRuleSchema);

module.exports = AutomationRule;