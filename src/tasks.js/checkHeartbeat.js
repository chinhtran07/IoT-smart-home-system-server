const mysqlDb = require('../models/mysql');
const redisClient = require('../config/redis.config'); 
const myEmitter = require('../events/eventsEmitter');

const checkHeartbeat = async () => {
    try {
        // Fetch all devices from MySQL
        const devices = await mysqlDb.Device.findAll({
            attributes: ['id', 'status']
        });
        const now = new Date();

        // Prepare an array of promises for checking heartbeats
        const checkPromises = devices.map(async (device) => {
            const deviceId = device.id;

            try {
                // Get last heartbeat time from Redis
                const lastHeartbeat = await redisClient.get(`heartbeat:${deviceId}`);
                console.log(`Last heartbeat for device ${deviceId}: ${lastHeartbeat}`);

                if (lastHeartbeat) {
                    const lastTime = new Date(lastHeartbeat);
                    const diffMinutes = (now - lastTime) / 60000;

                    if (diffMinutes >= 1) {
                        console.log(`Device ${deviceId} is Offline`);

                        // Update device status in MySQL
                        await mysqlDb.Device.update(
                            { status: 'offline' },
                            { where: { id: deviceId } }
                        );

                        data = {
                            alive: false,
                        }

                        // Delete heartbeat data from Redis
                        await redisClient.del(`heartbeat:${deviceId}`);
                        myEmitter.emit("heartbeat",  {device, data} );

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

const startService = () => {
    setInterval(checkHeartbeat, 60000);
};

module.exports = startService;
