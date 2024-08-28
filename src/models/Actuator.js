const mongoose = require("mongoose");

const actuatorSchema = new mongoose.Schema({
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    status: { type: Boolean, default: false },
    type: { type: String, required: true }, // e.g., switch, dimmer
    currentValue: { type: Map, of: mongoose.Schema.Types.Mixed},
});
  
const Actuator = mongoose.model('Actuator', actuatorSchema);


module.exports = Actuator;