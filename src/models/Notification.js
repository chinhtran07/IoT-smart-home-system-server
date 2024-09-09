const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['security', 'device_error', 'status_update'], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
}, {
    timestamps: true
  });
  
const Notification = mongoose.model('Notification', notificationSchema);


module.exports = Notification;