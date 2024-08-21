const eventSchema = new mongoose.Schema({
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    eventType: { type: String, required: true }, // e.g., motion_detected, temperature_change
    eventData: { type: Map, of: mongoose.Schema.Types.Mixed }, // JSON object for event data
    timestamp: { type: Date, default: Date.now },
  });
  
  const Event = mongoose.model('Event', eventSchema);
  