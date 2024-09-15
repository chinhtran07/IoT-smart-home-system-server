const mysqlDb = require('../models/mysql');
const redisClient = require('../config/redis.config'); 

const checkHeartbeat = async () => {
    try {
        const devices = await mysqlDb.Device.findAll({
            attributes: ['id', 'status']
        });
        const now = new Date();

        // Kiểm tra từng thiết bị
        for (const device of devices) {
            const deviceId = device.id;

            // Lấy thời gian heartbeat từ Redis
            redisClient.get(`heartbeat:${deviceId}`, async (err, lastHeartbeat) => {
                if (err) {
                    console.error('Error fetching heartbeat from Redis:', err);
                    return;
                }

                console.log(lastHeartbeat);

                if (lastHeartbeat) {
                    const lastTime = new Date(lastHeartbeat);
                    const diffMinutes = (now - lastTime) / 60000;

                    if (diffMinutes >= 1) {
                        console.log(`Device ${deviceId} is Offline`);

                        await mysqlDb.Device.update(
                            { status: 'offline' },
                            { where: { id: deviceId } }
                        );

                        redisClient.del(`heartbeat:${deviceId}`);
                    }
                } else {
                    console.log(`No heartbeat data found for device ${deviceId}. Marking as Offline.`);

                    await mysqlDb.Device.update(
                        { status: 'offline' },
                        { where: { id: deviceId } }
                    );

                    // emit to socket
                }
            });
        }
    } catch (error) {
        console.error('Error checking heartbeat:', error.message);
    }
};

const startService = () => {
    setInterval(checkHeartbeat, 60000);
}

module.exports = startService;
