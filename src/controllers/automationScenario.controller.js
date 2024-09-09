const { getGatewayByUser } = require("../services/gateway.services");
const automationScenarioService = require('../services/automationScenario.services');
const { default: axios } = require("axios");
const generateFlow = require('../utils/node-red/generateFlow');
const { createFlow, updateFlow } = require("../utils/node-red/api");

const createAutomationScenario = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const gateway = await getGatewayByUser(userId);
        const scenario = await automationScenarioService.createScenario(req.body, userId);
       
        const flowJson = generateFlow(scenario, gateway);
        
        const status = await createFlow(gateway.ipAddress, flowJson);
        
        if (status === 200)
            res.status(201).flowJson(scenario._id);
        else
            res.status(status);
        
    } catch (error) {
        next(error);
    }
}

const updateAutomationScenario = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const scenarioId = req.params.id;
        const gateway = await getGatewayByUser(userId);
        const scenario = await automationScenarioService.updateScenario(scenarioId, req.body);

        const flowJson = generateFlow(scenario, gateway);

        const status = await updateFlow(gateway.ipAddress, flowJson, scenarioId);

        res.status(status);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createAutomationScenario,
    updateAutomationScenario
}