const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: { type: String, required: true },
  type: { type: String, required: true }, // actuator, sensor
  gatewayId: {type: mongoose.Schema.Types.ObjectId, ref: 'Gateway', required: true},
  manufacturer: { type: String },
  modelNumber: { type: String },
  macAddress: { type: String, required: true, unique: true },
  topics: [{type: String, required: true}],
  statusDevice: { type: String, enum: ['online', 'offline', 'error'], default: 'offline' },
  configuration: { type: Map, of: mongoose.Schema.Types.Mixed }, // JSON object to store settings
}, {
  timestamps: true
});


const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;  