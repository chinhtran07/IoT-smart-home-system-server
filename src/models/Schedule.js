const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  action: [{
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    action: { type: String, required: true },
    value: { type: Map, of:mongoose.Schema.Types.Mixed }
  }],
  scheduleType: { type: String, enum: ['one-time', 'recurring'], required: true }, 
  date: { type: Date },
  recurrence: { 
    interval: { type: String, enum: ['daily', 'weekly', 'monthly'], required: function() { return this.scheduleType === 'recurring'; } },
    daysOfWeek: [{ type: String, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }], 
    timeOfDay: { type: String },
  },
  enabled: { type: Boolean, default: true },
  lastExecuted: { type: Date },
}, {
  timestamps: true
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;