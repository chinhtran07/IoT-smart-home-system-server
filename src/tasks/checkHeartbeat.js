import redisClient from '../config/redis.config.js';
import myEmitter from '../events/eventsEmitter.js';
import Device from '../models/device.model.js'; // Import the Device model

const checkHeartbeat = async () => {
  try {
    const devices = await Device.find({}, { _id: 1, status: 1 });
    const now = new Date();

    const checkPromises = devices.map(async (device) => {
      const deviceId = device._id.toString();

      try {
        const lastHeartbeat = await redisClient.get(`heartbeat:${deviceId}`);

        if (!lastHeartbeat) {
          return;
        }

        const lastTime = new Date(lastHeartbeat);
        const diffMinutes = (now - lastTime) / 60000; 

        if (diffMinutes >= 1 && device.status === true) {
          console.log(`Device ${deviceId} is now Offline`);

          await Device.updateOne({ _id: deviceId }, { status: false });

          const data = { alive: false };

          myEmitter.emit('heartbeat', { device, data });
          await redisClient.del(`heartbeat:${deviceId}`);
        }
      } catch (err) {
        console.error(`Error processing heartbeat for device ${deviceId}:`, err);
      }
    });

    await Promise.all(checkPromises);
  } catch (error) {
    console.error('Error checking heartbeat:', error.message);
  }
};

let intervalId;

export const startService = () => {
  // Start the heartbeat check interval
  intervalId = setInterval(() => {
    checkHeartbeat();
  }, 60000); // Check every minute

  // Return a function to stop the service by clearing the interval
  return () => clearInterval(intervalId);
};
