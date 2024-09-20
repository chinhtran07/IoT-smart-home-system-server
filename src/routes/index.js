// mainRoutes.js
import express from 'express';

const router = express.Router();

import gatewayRoutes from './gateway.routes.js';
import userRoutes from './user.routes.js';
import deviceRoutes from './device.routes.js';
import scheduleRoutes from './schedule.routes.js';
import scenarioRoutes from './scenario.routes.js';
import controlRoutes from './control.routes.js';
import accessControlRoutes from './accessControl.routes.js';
import groupRoutes from './group.routes.js';

router.use('/gateways', gatewayRoutes);
router.use('/users', userRoutes);
router.use('/devices', deviceRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/scenarios', scenarioRoutes);
router.use('/control', controlRoutes);
router.use('/access-control', accessControlRoutes);
router.use('/groups', groupRoutes);

export default router;
