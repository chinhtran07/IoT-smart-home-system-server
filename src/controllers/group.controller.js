import * as groupService from '../services/group.service.js';
import redisClient from '../config/redis.config.js'; // Import Redis client
import CustomError from '../utils/CustomError.js';

const CACHE_EXPIRY = 3600; // Cache expiry time in seconds (e.g., 1 hour)

export const addGroup = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { name, type } = req.body;
        const newGroup = await groupService.addGroup(name, userId, type);

        // Clear all cache related to the user since a new group is created
        await redisClient.del(`groupsByUser:${userId}`);

        res.status(201).json(newGroup);
    } catch (error) {
        next(error);
    }
};

export const addDeviceToGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const { deviceIds } = req.body;
        await groupService.addDevicesToGroup(groupId, deviceIds);

        // Clear the cache for the specific group where devices are added
        await redisClient.del(`group:${groupId}`);
        
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

export const removeDevicesFromGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const { deviceIds } = req.body;
        await groupService.removeDevicesFromGroup(groupId, deviceIds);

        // Clear the cache for the specific group where devices are removed
        await redisClient.del(`group:${groupId}`);

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const getAllGroups = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cacheKey = `groupsByUser:${userId}`;

        // Try to fetch from Redis cache first
        const cachedGroups = await redisClient.get(cacheKey);
        if (cachedGroups) {
            return res.status(200).json(JSON.parse(cachedGroups));
        }

        // If not found in cache, fetch from database
        const groups = await groupService.getAllGroups(userId);

        // Cache the result in Redis
        await redisClient.set(cacheKey, JSON.stringify(groups), { EX: CACHE_EXPIRY });

        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
};

export const getGroupById = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const cacheKey = `group:${groupId}`;

        // Try to fetch from Redis cache first
        const cachedGroup = await redisClient.get(cacheKey);
        if (cachedGroup) {
            return res.status(200).json(JSON.parse(cachedGroup));
        }

        // If not found in cache, fetch from database
        const group = await groupService.getGroupById(groupId);

        if (group) {
            // Cache the result in Redis
            await redisClient.set(cacheKey, JSON.stringify(group), { EX: CACHE_EXPIRY });
            return res.status(200).json(group);
        } else {
            return res.status(404).json({ message: "Group not found" });
        }
    } catch (error) {
        next(error);
    }
};

export const getGroupsByAccessControl = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const cacheKey = `groupsByAccessControl:${userId}`;

        // Try to fetch from Redis cache first
        const cachedGroups = await redisClient.get(cacheKey);
        if (cachedGroups) {
            return res.status(200).json(JSON.parse(cachedGroups));
        }

        // Fetch from database if not cached
        const groups = await groupService.getGroupsByAccessControl(userId);

        // Cache the result in Redis
        await redisClient.set(cacheKey, JSON.stringify(groups), { EX: CACHE_EXPIRY });

        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
};

export const updateGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const updateData = req.body;
        await groupService.updateGroup(groupId, updateData);

        // Clear cache for the updated group
        await redisClient.del(`group:${groupId}`);

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const deleteGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        await groupService.deleteGroup(groupId);

        // Clear cache for the deleted group
        await redisClient.del(`group:${groupId}`);

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const updateIcon = async (req, res, next) => {
    try {
      const groupId = req.params.id;
      const file = req.file;
      if (!file) {
        next(CustomError("No file uploaded", 400));
      }
  
      const url = await groupService.uploadIcon(groupId, file);
  
      res.status(200).json({ icon: url });
  
    } catch (error) {
      next(error);
    }
  }