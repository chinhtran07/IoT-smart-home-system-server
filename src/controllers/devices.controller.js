import * as deviceService from '../services/device.service.js'; 
import redisClient from '../config/redis.config.js'; // Import Redis client
import CustomError from '../utils/CustomError.js';

const CACHE_EXPIRY = 3600; // Cache expiry time in seconds (e.g., 1 hour)

export const getAllDevices = async (req, res, next) => {
    try {

        const devices = await deviceService.getAllDevices();

        res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
};

export const getDeviceById = async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        const cacheKey = `device:${deviceId}`;

        // Try to fetch from Redis cache first
        const cachedDevice = await redisClient.get(cacheKey);
        if (cachedDevice) {
            return res.status(200).json(JSON.parse(cachedDevice));
        }

        // If not found in cache, fetch from database
        const device = await deviceService.getDeviceById(deviceId);

        if (device) {
            // Cache the result in Redis
            await redisClient.set(cacheKey, JSON.stringify(device), { EX: CACHE_EXPIRY });
            return res.status(200).json(device);
        } else {
            return res.status(404).json({ message: "Device not found" });
        }
    } catch (error) {
        next(error);
    }
};

export const updateDevice = async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        const dataToUpdate = req.body;

        if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
            return next(new CustomError("No data provided for update", 400));
        }

        const updatedDevice = await deviceService.updateDevice(deviceId, dataToUpdate);

        if (updatedDevice) {
            // Clear cache for the updated device
            await redisClient.del(`device:${deviceId}`);
            return res.sendStatus(204);
        } else {
            return res.status(404).json({ message: "Device not found" });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteDevice = async (req, res, next) => {
    try {
        const deviceId = req.params.id;
        await deviceService.deleteDevice(deviceId);

        // Clear cache for the deleted device
        await redisClient.del(`device:${deviceId}`);
        
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const getDevicesOwner = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const cacheKey = `devicesOwner:${userId}:${page}:${limit}`;

        // Try to fetch from Redis cache first
        const cachedDevices = await redisClient.get(cacheKey);
        if (cachedDevices) {
            return res.status(200).json(JSON.parse(cachedDevices));
        }

        // Fetch from database if not cached
        const devices = await deviceService.getDevicesOwner(userId, page, limit);

        // Cache the result in Redis
        await redisClient.set(cacheKey, JSON.stringify(devices), { EX: CACHE_EXPIRY });

        res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
};

export const getDevicesByAccessControl = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const cacheKey = `devicesByAccessControl:${userId}:${page}:${limit}`;

        // Try to fetch from Redis cache first
        const cachedDevices = await redisClient.get(cacheKey);
        if (cachedDevices) {
            return res.status(200).json(JSON.parse(cachedDevices));
        }

        // Fetch from database if not cached
        const devices = await deviceService.getDevicesByAccessControl(userId, page, limit);

        // Cache the result in Redis
        await redisClient.set(cacheKey, JSON.stringify(devices), { EX: CACHE_EXPIRY });

        res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
};
