const mongoose = require('mongoose');

const gatewaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    macAddress: { type: String, required: true, unique: true },
    ipAddress: { type: String, required: true },
    status: { type: String, enum: ['online', 'offline', 'maintenance'], default: 'offline' },
    lastSeen: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamp: true
});


const Gateway = mongoose.model('Gateway', gatewaySchema);

module.exports = Gateway;