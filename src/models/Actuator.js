const mongoose = require("mongoose");

const actuatorSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    properties: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    type: { type: String, required: true },
    action: {type: String, enum: ["control", "modify"], default: "control"}
});
  
const Actuator = mongoose.model('Actuator', actuatorSchema);


module.exports = Actuator;