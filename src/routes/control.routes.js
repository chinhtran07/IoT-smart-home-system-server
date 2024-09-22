// controlRoutes.js
import express from 'express';
import * as controlController from '../controllers/control.controller.js';
import deviceAccessMiddleware from '../middlewares/deviceAccess.middleware.js';

const router = express.Router();

/**
 * @openapi
 * /control:
 *   post:
 *     description: Control a device
 *     tags:
 *       - Control
 *     responses:
 *       200:
 *         description: Device controlled successfully
 *       403:
 *         description: Forbidden
 */
router.post('/', deviceAccessMiddleware, controlController.controlDevice);

export default router;
