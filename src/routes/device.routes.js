// deviceRoutes.js
import express from 'express';
import * as deviceController from '../controllers/devices.controller.js';
import { authorize } from '../middlewares/auth.middleware.js';
import deviceAccess from '../middlewares/deviceAccess.middleware.js';

const router = express.Router();

/**
 * @openapi
 * /devices:
 *   get:
 *     description: Get all devices (admin only)
 *     tags:
 *       - Devices
 *     responses:
 *       200:
 *         description: List of all devices
 *       403:
 *         description: Forbidden
 */
router.get('/', authorize(['admin']), deviceController.getAllDevices);

/**
 * @openapi
 * /devices/owner:
 *   get:
 *     description: Get devices by owner
 *     tags:
 *       - Devices
 *     responses:
 *       200:
 *         description: List of devices by owner
 */
router.get('/owner', deviceController.getDevicesOwner);

/**
 * @openapi
 * /devices/access-control:
 *   get:
 *     description: Get devices by access control
 *     tags:
 *       - Devices
 *     responses:
 *       200:
 *         description: List of devices by access control
 */
router.get('/access-control', deviceController.getDevicesByAccessControl);

/**
 * @openapi
 * /devices/{id}:
 *   get:
 *     description: Get a device by ID
 *     tags:
 *       - Devices
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device details
 *       404:
 *         description: Device not found
 */
router.get('/:id', deviceAccess, deviceController.getDeviceById);

/**
 * @openapi
 * /devices/{id}:
 *   put:
 *     description: Update a device by ID
 *     tags:
 *       - Devices
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device updated successfully
 *       404:
 *         description: Device not found
 */
router.put('/:id', deviceAccess, deviceController.updateDevice);

/**
 * @openapi
 * /devices/{id}:
 *   delete:
 *     description: Delete a device by ID
 *     tags:
 *       - Devices
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the device
 *     responses:
 *       204:
 *         description: Device deleted successfully
 *       404:
 *         description: Device not found
 */
router.delete('/:id', deviceAccess, deviceController.deleteDevice);

export default router;
