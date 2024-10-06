// mainRoutes.js
import express from 'express';

const router = express.Router();

import gatewayRoutes from './gateway.route.js';
import userRoutes from './user.route.js';
import deviceRoutes from './device.route.js';
import scenarioRoutes from './scenario.route.js';
import controlRoutes from './control.route.js';
import accessControlRoutes from './accessControl.route.js';
import groupRoutes from './group.route.js';
import sceneRoutes from './scene.route.js';

router.use('/gateways', gatewayRoutes);
router.use('/users', userRoutes);
router.use('/devices', deviceRoutes);
router.use('/scenarios', scenarioRoutes);
router.use('/control', controlRoutes);
router.use('/access-control', accessControlRoutes);
router.use('/groups',groupRoutes);
router.use('/scenes', sceneRoutes);

export default router;
