// schedule.routes.js
import express from 'express';

const router = express.Router();
import * as scheduleController from '../controllers/schedule.controller.js';

router.post('', scheduleController.createSchedule);
router.get('', scheduleController.getAllSchedules);
router.get('/:id', scheduleController.getScheduleById);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

export default router;
