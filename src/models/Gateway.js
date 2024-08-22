const mongoose = require('mongoose');

const gatewaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    macAddress: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    protocol: { type: String, enum: ['Zigbee', 'Z-Wave', 'MQTT', 'WiFi'], required: true },
    deviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
    ipAddress: { type: String },
    status: { type: String, enum: ['online', 'offline', 'maintenance'], default: 'offline' },
    lastSeen: { type: Date, default: Date.now },
}, {
    timestamp: true
});


const Gateway = mongoose.model('Gateway', gatewaySchema);

module.exports = Gateway;