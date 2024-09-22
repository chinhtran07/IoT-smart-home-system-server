// scenario.routes.js
import express from 'express';

const router = express.Router();
import * as scenarioController from '../controllers/scenario.controller.js';

router.post('', scenarioController.createAutomationScenario);
router.get('/owner', scenarioController.getScenariosByUser);
router.get('/:id', scenarioController.getScenarioById);
router.put('/:id', scenarioController.updateAutomationScenario);
router.delete('/:id', scenarioController.deleteScenario);

export default router;
