const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['room', 'category', 'custom'], default: 'custom' }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
}, {
  timestamps: true,
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;