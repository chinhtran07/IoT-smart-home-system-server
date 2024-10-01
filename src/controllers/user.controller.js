import * as userServices from '../services/user.service.js';
import redisClient from '../config/redis.config.js'; // Import Redis client
import CustomError from '../utils/CustomError.js';

const CACHE_EXPIRY = 3600; // Cache expiry time in seconds (e.g., 1 hour)

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const cacheKey = `userProfile:${userId}`;
    
    // Try to fetch from Redis cache first
    const cachedUser = await redisClient.get(cacheKey);
    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));
    }
    
    // Fetch from database if not cached
    const user = await userServices.getProfile(userId);
    if (user) {
      // Cache the result in Redis
      await redisClient.set(cacheKey, JSON.stringify(user), { EX: CACHE_EXPIRY });
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cacheKey = `userProfile:${userId}`;
    
    // Try to fetch from Redis cache first
    const cachedUser = await redisClient.get(cacheKey);
    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));
    }
    
    // Fetch from database if not cached
    const user = await userServices.getProfile(userId);
    if (user) {
      // Cache the result in Redis
      await redisClient.set(cacheKey, JSON.stringify(user), { EX: CACHE_EXPIRY });
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    await userServices.updateUserProfile(req.user._id, { firstName, lastName, email, phone });
    
    // Clear cache for the updated user profile
    await redisClient.del(`userProfile:${req.user._id}`);
    
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userServices.changePassword(req.user._id, currentPassword, newPassword);
    
    // Clear cache for the updated user profile
    await redisClient.del(`userProfile:${req.user._id}`);
    
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await userServices.deleteUser(req.params.id);
    
    // Clear cache for the deleted user profile if the user is in cache
    await redisClient.del(`userProfile:${req.params.id}`);
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userServices.getAllUsers(req.query);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    if (!file) {
      next(CustomError("No file uploaded", 400));
    }

    const url = await userServices.updateAvatar(userId, file);

    res.status(200).json({ avatarURI: url });

  } catch (error) {
    next(error);
  }
}
