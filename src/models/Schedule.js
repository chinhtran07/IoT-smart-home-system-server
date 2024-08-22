const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  deviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true }],
  groupIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DeviceGroup' }],
  action: { type: String, required: true }, 
  parameters: { type: Map, of: mongoose.Schema.Types.Mixed },
  scheduleType: { type: String, enum: ['one-time', 'recurring'], required: true }, 
  date: { type: Date },
  recurrence: { 
    interval: { type: String, enum: ['daily', 'weekly', 'monthly'], required: function() { return this.scheduleType === 'recurring'; } },
    daysOfWeek: [{ type: String, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }], 
    timeOfDay: { type: String },
  },
  enabled: { type: Boolean, default: true },
  lastExecuted: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;