const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: { type: String, required: true },
  type: { type: String, required: true },
  gatewayId: {type: mongoose.Schema.Types.ObjectId, ref: 'Gateway', required: true},
  manufacturer: { type: String },
  modelNumber: { type: String },
  status: { type: String, enum: ['online', 'offline', 'error'], default: 'offline' },
  lastUpdate: { type: Date, default: Date.now },
  configuration: { type: Map, of: mongoose.Schema.Types.Mixed }, // JSON object to store settings
}, {
  timestamps: true
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;