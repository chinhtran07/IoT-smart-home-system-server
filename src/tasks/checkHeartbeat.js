import redisClient from '../config/redis.config.js';
import myEmitter from '../events/eventsEmitter.js';
import Device from '../models/device.model.js'; // Import the Device model

const checkHeartbeat = async () => {
  try {
    // Fetch all devices from MongoDB
    const devices = await Device.find({}, { _id: 1, status: 1 });
    const now = new Date();

    // Prepare an array of promises for checking heartbeats
    const checkPromises = devices.map(async (device) => {
      const deviceId = device._id.toString();

      try {
        // Get last heartbeat time from Redis
        const lastHeartbeat = await redisClient.get(`heartbeat:${deviceId}`);
        console.log(`Last heartbeat for device ${deviceId}: ${lastHeartbeat}`);

        if (lastHeartbeat) {
          const lastTime = new Date(lastHeartbeat);
          const diffMinutes = (now - lastTime) / 60000;

          // Check if the device has been offline for over a minute
          if (diffMinutes >= 1 && device.status === true) {
            console.log(`Device ${deviceId} is Offline`);

            // Update device status to offline in MongoDB
            await Device.updateOne({ _id: deviceId }, { status: false });

            const data = {
              alive: false,
            };

            // Emit event and remove heartbeat from Redis
            myEmitter.emit('heartbeat', { device, data });
            await redisClient.del(`heartbeat:${deviceId}`);
          }
        }
      } catch (err) {
        console.error(`Error processing heartbeat for device ${deviceId}:`, err);
      }
    });

    // Wait for all heartbeat checks to complete
    await Promise.all(checkPromises);
  } catch (error) {
    console.error('Error checking heartbeat:', error.message);
  }
};

let intervalId;

export const startService = () => {
  intervalId = setInterval(() => {
    checkHeartbeat();
  }, 60000); // Check every minute

  return () => clearInterval(intervalId); // Clear the interval on service stop
};
