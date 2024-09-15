const express = require("express");
const router = express.Router();
const scenarioController = require('../controllers/scenario.controller');

router.post("", scenarioController.createAutomationScenario);
router.get("/owner", scenarioController.getScenariosByUser);
router.get("/:id", scenarioController.getScenarioById);
router.put("/:id", scenarioController.updateAutomationScenario);
router.delete("/:id", scenarioController.deleteScenario);

module.exports = router;
