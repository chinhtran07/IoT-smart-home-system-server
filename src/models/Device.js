const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., light, thermostat
  manufacturer: { type: String },
  modelNumber: { type: String },
  status: { type: String, enum: ['online', 'offline', 'error'], default: 'offline' },
  lastUpdate: { type: Date, default: Date.now },
  configuration: { type: Map, of: mongoose.Schema.Types.Mixed }, // JSON object to store settings
});

const Device = mongoose.model('Device', deviceSchema);
