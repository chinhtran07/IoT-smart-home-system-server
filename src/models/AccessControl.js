const mongoose = require('mongoose');

const accessControlSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    permissionLevel: { type: String, enum: ['read', 'write', 'admin'], required: true },
  });
  
const AccessControl = mongoose.model('AccessControl', accessControlSchema);
  
module.exports = AccessControl;