const gatewayService = require('../services/gateway.services');
const redisClient = require('../config/redis.config'); // Import Redis client
const CustomError = require('../utils/CustomError');

const CACHE_EXPIRY = 3600; // Cache expiry time in seconds (e.g., 1 hour)

const createGateway = async (req, res, next) => {
    try {
        const gatewayData = req.body;
        console.info(gatewayData);
        const gateway = await gatewayService.createGateway(gatewayData, req.user._id);
        
        // Clear all related cache since a new gateway is created
        await redisClient.del(`gatewaysByUser:${req.user.id}`);
        
        res.status(201).json(gateway);
    } catch (error) {
        next(error);
    }
};

const addDevice = async (req, res, next) => {
    try {
        const deviceData = req.body;
        const device = await gatewayService.addDevice(deviceData, req.params.id, req.user._id);
        
        // Clear cache related to the gateway where the device is added
        await redisClient.del(`gateway:${req.params.id}`);
        
        res.status(201).json(device);
    } catch (error) {
        next(error);
    }
};

const getGatewayById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const cacheKey = `gateway:${id}`;

        // Try to fetch from Redis cache first
        const cachedGateway = await redisClient.get(cacheKey);
        if (cachedGateway) {
            return res.status(200).json(JSON.parse(cachedGateway));
        }

        // If not found in cache, fetch from database
        const gateway = await gatewayService.getGatewayById(id);

        if (gateway) {
            // Cache the result in Redis
            await redisClient.set(cacheKey, JSON.stringify(gateway), { EX: CACHE_EXPIRY });
            return res.status(200).json(gateway);
        } else {
            return res.status(404).json({ message: "Gateway not found" });
        }
    } catch (error) {
        next(error);
    }
};

const getGatewaysByUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cacheKey = `gatewaysByUser:${userId}`;

        // Try to fetch from Redis cache first
        const cachedGateways = await redisClient.get(cacheKey);
        if (cachedGateways) {
            return res.status(200).json(JSON.parse(cachedGateways));
        }

        // Fetch from database if not cached
        const gateways = await gatewayService.getGatewayByUser(userId);

        // Cache the result in Redis
        await redisClient.set(cacheKey, JSON.stringify(gateways), { EX: CACHE_EXPIRY });

        res.status(200).json(gateways);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createGateway,
    addDevice,
    getGatewayById,
    getGatewaysByUser
};
