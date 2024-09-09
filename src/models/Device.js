const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: { type: String, required: true },
  type: { type: String, required: true }, // actuator, sensor
  gatewayId: {type: mongoose.Schema.Types.ObjectId, ref: 'Gateway'},
  manufacturer: { type: String },
  modelNumber: { type: String },
  macAddress: { type: String, required: true, unique: true },
  topics: {
    publisher: [{ type: String }],
    subscriber: [{type: String}]
  },
  statusDevice: { type: String, enum: ['online', 'offline', 'error'], default: 'offline' },
}, {
  timestamps: true
});


const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;  