const { getGatewayByUser } = require("../services/gateway.services");
const scenarioService = require("../services/scenario.service");
const redisClient = require('../config/redis.config'); // Import Redis client

const CACHE_EXPIRY = 3600; // Cache expiry time in seconds (e.g., 1 hour)

const createAutomationScenario = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const scenario = await scenarioService.createScenario(req.body, userId);
    
    // Clear cache related to scenarios for the user
    await redisClient.del(`scenariosByUser:${userId}`);
    
    res.status(201).json(scenario);
  } catch (error) {
    next(error);
  }
};

const updateAutomationScenario = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const scenarioId = req.params.id;
    
    // Fetch the gateway (optional, depending on your business logic)
    await getGatewayByUser(userId);
    
    const scenario = await scenarioService.updateScenario(scenarioId, req.body);
    
    // Clear cache for the specific scenario
    await redisClient.del(`scenario:${scenarioId}`);
    
    // Clear cache for the user's scenarios
    await redisClient.del(`scenariosByUser:${userId}`);
    
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getScenariosByUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cacheKey = `scenariosByUser:${userId}`;
    
    // Try to fetch from Redis cache first
    const cachedScenarios = await redisClient.get(cacheKey);
    if (cachedScenarios) {
      return res.status(200).json(JSON.parse(cachedScenarios));
    }
    
    // Fetch from database if not cached
    const scenarios = await scenarioService.getScenariosByUser(userId);
    
    // Cache the result in Redis
    await redisClient.set(cacheKey, JSON.stringify(scenarios), { EX: CACHE_EXPIRY });
    
    res.status(200).json(scenarios);
  } catch (error) {
    next(error);
  }
};

const getScenarioById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cacheKey = `scenario:${id}`;
    
    // Try to fetch from Redis cache first
    const cachedScenario = await redisClient.get(cacheKey);
    if (cachedScenario) {
      return res.status(200).json(JSON.parse(cachedScenario));
    }
    
    // Fetch from database if not cached
    const scenario = await scenarioService.getScenarioById(id);
    
    if (scenario) {
      // Cache the result in Redis
      await redisClient.set(cacheKey, JSON.stringify(scenario), { EX: CACHE_EXPIRY });
      return res.status(200).json(scenario);
    } else {
      return res.status(404).json({ message: "Scenario not found" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteScenario = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;
    
    const message = await scenarioService.deleteScenario(id);
    
    // Clear cache for the specific scenario
    await redisClient.del(`scenario:${id}`);
    
    // Clear cache for the user's scenarios
    await redisClient.del(`scenariosByUser:${userId}`);
    
    res.status(204).json(message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAutomationScenario,
  updateAutomationScenario,
  getScenarioById,
  getScenariosByUser,
  deleteScenario
};
