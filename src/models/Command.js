const { default: mongoose } = require("mongoose");

const commandSchema = new mongoose.Schema({
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    commandType: { type: String, required: true }, // e.g., turn_on, set_brightness
    parameters: { type: Map, of: mongoose.Schema.Types.Mixed }, // JSON object for command parameters
    timestamp: { type: Date, default: Date.now },
  });
  
  const Command = mongoose.model('Command', commandSchema);
  
  module.exports = Command;