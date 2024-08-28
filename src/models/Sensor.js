const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    unit: { type: String, required: true },
    type: { type: String, required: true }, // e.g., temperature, humidity
    currentValue: { type: Number, default: 0 },
  });
  

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;