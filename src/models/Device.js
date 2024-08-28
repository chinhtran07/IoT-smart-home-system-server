const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: { type: String, required: true },
  type: { type: String, required: true }, // actuator, sensor
  gatewayId: {type: mongoose.Schema.Types.ObjectId, ref: 'Gateway', required: true},
  manufacturer: { type: String },
  modelNumber: { type: String },
  macAddress: { type: String, required: true, unique: true },
  topic: [{type: String, required: true}],
  statusDevice: { type: String, enum: ['online', 'offline', 'error'], default: 'offline' },
  configuration: { type: Map, of: mongoose.Schema.Types.Mixed }, // JSON object to store settings
}, {
  timestamps: true
});

const sensorSchema = new mongoose.Schema({
  unit: {
      type: String, 
      required: true,
  },
  type: {
    type: String
  },
});

const actuatorSchema = new mongoose.Schema({
  status: {
      type: Boolean,
      default: false
  },
  type: {
    type: String,
  },
  currentValue: {
    type: Number,
  }
});

const Device = mongoose.model('Device', deviceSchema);
const Actuator = Device.discriminator('Actuator', actuatorSchema);
const Sensor = Device.discriminator('Sensor', sensorSchema);

module.exports = {Device, Actuator, Sensor};  