const mongoDb = require('../models/mongo');
const mysqlDb = require('../models/mysql');
const redisClient = require('../config/redis.config'); // Import Redis client

const CACHE_EXPIRY = 3600; // Cache expiry time in seconds (e.g., 1 hour)

const checkDeviceAccess = async (req, res, next) => {
    try {
        const id = req.params.id || req.body.deviceId;

        // Check Redis cache for device access
        const cacheKey = `deviceAccess:${req.user._id}:${id}`;
        const cachedAccess = await redisClient.get(cacheKey);
        if (cachedAccess !== null) {
            if (cachedAccess === 'true') {
                next();
                return;
            } else {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        // Fetch device from MySQL
        const device = await mysqlDb.Device.findByPk(id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Check if the device belongs to the user
        if (device.userId === req.user._id) {
            // Cache the result in Redis
            await redisClient.set(cacheKey, 'true', { EX: CACHE_EXPIRY });
            next();
            return;
        }

        // Check MongoDB for access control
        const access = await mongoDb.AccessControl.findOne({
            userId: req.user._id,
            'permissions.device': id
        });

        if (!access) {
            // Cache the result in Redis
            await redisClient.set(cacheKey, 'false', { EX: CACHE_EXPIRY });
            return res.status(403).json({ message: 'Access denied' });
        }

        // Cache the result in Redis
        await redisClient.set(cacheKey, 'true', { EX: CACHE_EXPIRY });
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = checkDeviceAccess;
