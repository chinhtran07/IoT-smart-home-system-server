const scheduleService = require('../services/schedule.services');
const redisClient = require('../config/redis.config'); // Import Redis client
const CustomError = require('../utils/CustomError');

const CACHE_EXPIRY = 3600; // Cache expiry time in seconds (e.g., 1 hour)

const createSchedule = async (req, res, next) => {
  try {
    const schedule = await scheduleService.createSchedule(req.body);
    
    // Clear all schedules cache for the user
    await redisClient.del(`schedulesByUser:${req.user._id}`);
    
    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
};

const getAllSchedules = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cacheKey = `schedulesByUser:${userId}`;
    
    // Try to fetch from Redis cache first
    const cachedSchedules = await redisClient.get(cacheKey);
    if (cachedSchedules) {
      return res.status(200).json(JSON.parse(cachedSchedules));
    }
    
    // Fetch from database if not cached
    const schedules = await scheduleService.getAllSchedules(userId);
    
    // Cache the result in Redis
    await redisClient.set(cacheKey, JSON.stringify(schedules), { EX: CACHE_EXPIRY });
    
    res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
};

const getScheduleById = async (req, res, next) => {
  const { id } = req.params;
  const cacheKey = `schedule:${id}`;
  
  try {
    // Try to fetch from Redis cache first
    const cachedSchedule = await redisClient.get(cacheKey);
    if (cachedSchedule) {
      return res.status(200).json(JSON.parse(cachedSchedule));
    }
    
    // Fetch from database if not cached
    const schedule = await scheduleService.getScheduleById(id);
    
    if (schedule) {
      // Cache the result in Redis
      await redisClient.set(cacheKey, JSON.stringify(schedule), { EX: CACHE_EXPIRY });
      return res.status(200).json(schedule);
    } else {
      return res.status(404).json({ message: "Schedule not found" });
    }
  } catch (error) {
    next(error);
  }
};

const updateSchedule = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const updatedSchedule = await scheduleService.updateSchedule(id, req.body);
    
    // Clear cache for the specific schedule
    await redisClient.del(`schedule:${id}`);
    
    // Clear cache for all schedules of the user
    await redisClient.del(`schedulesByUser:${req.user._id}`);
    
    res.status(200).json(updatedSchedule);
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    await scheduleService.deleteSchedule(id);
    
    // Clear cache for the specific schedule
    await redisClient.del(`schedule:${id}`);
    
    // Clear cache for all schedules of the user
    await redisClient.del(`schedulesByUser:${req.user._id}`);
    
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
};
