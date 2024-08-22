const mongoose = require('mongoose');

const deviceGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  deviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true }], 
  groupType: { type: String, enum: ['room', 'category', 'custom'], default: 'custom' }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, 
});

const DeviceGroup = mongoose.model('DeviceGroup', deviceGroupSchema);

module.exports = DeviceGroup;