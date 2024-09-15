const { getGatewayByUser } = require("../services/gateway.services");
const scenarioService = require("../services/scenario.service");
const generateFlow = require("../node-red/generateFlow");
const { createFlow, updateFlow } = require("../node-red/api");

const createAutomationScenario = async (req, res, next) => {
  try {
    const userId = req.user._id;
      const scenario = await scenarioService.createScenario(req.body, userId);
      res.status(201).json(scenario);
  } catch (error) {
    next(error);
  }
};

const updateAutomationScenario = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const scenarioId = req.params.id;
    const gateway = await getGatewayByUser(userId);
    const scenario = await scenarioService.updateScenario(scenarioId, req.body);

    const flowJson = await generateFlow(scenario, gateway);

    const status = await updateFlow(gateway.ipAddress, flowJson, scenarioId);

    res.status(status);
  } catch (error) {
    next(error);
  }
};

const getScenariosByUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const scenarios = await scenarioService.getScenariosByUser(userId);
    res.status(200).json(scenarios);
  } catch (error) {
    next(error);
  }
};

const getScenarioById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const scenario = await scenarioService.getScenarioById(id);
    res.status(200).json(scenario);
  } catch (error) {
    next(error);
  }
};

const deleteScenario = async (req, res, next) => {
  try {
    const id = req.params.id;
    const message = await scenarioService.deleteScenario(id);
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
  deleteScenario,
};
