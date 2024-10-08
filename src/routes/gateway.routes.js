// gatewayRoutes.js
import express from 'express';
import * as gatewayController from '../controllers/gateway.controller.js';

const router = express.Router();

/**
 * @openapi
 * /gateways:
 *   post:
 *     description: Create a new gateway
 *     tags:
 *       - Gateways
 *     responses:
 *       201:
 *         description: Gateway created successfully
 */
router.post('/', gatewayController.createGateway);

/**
 * @openapi
 * /gateways/{id}/devices:
 *   post:
 *     description: Add a device to a gateway
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the gateway
 *     responses:
 *       200:
 *         description: Device added to gateway successfully
 *       404:
 *         description: Gateway not found
 */
router.post('/:id/devices', gatewayController.addDevice);

/**
 * @openapi
 * /gateways/user:
 *   get:
 *     description: Get gateways associated with the current user
 *     tags:
 *       - Gateways
 *     responses:
 *       200:
 *         description: List of gateways for the user
 */
router.get('/user', gatewayController.getGatewaysByUser);

/**
 * @openapi
 * /gateways/{id}:
 *   get:
 *     description: Get a specific gateway by ID
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the gateway
 *     responses:
 *       200:
 *         description: Gateway details
 *       404:
 *         description: Gateway not found
 */
router.get('/:id', gatewayController.getGatewayById);

export default router;
