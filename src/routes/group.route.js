// groupRoutes.js
import express from 'express';
import * as groupController from '../controllers/group.controller.js';
import upload from '../utils/upload.js';

const router = express.Router();

/**
 * @openapi
 * /groups:
 *   post:
 *     description: Add a new group
 *     tags:
 *       - Groups
 *     responses:
 *       201:
 *         description: Group added successfully
 */
router.post('', groupController.addGroup);

/**
 * @openapi
 * /groups:
 *   get:
 *     description: Get all groups
 *     tags:
 *       - Groups
 *     responses:
 *       200:
 *         description: List of all groups
 */
router.get('', groupController.getAllGroups);

/**
 * @openapi
 * /groups/{id}/devices/add:
 *   post:
 *     description: Add a device to a group
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: Device added to group successfully
 *       404:
 *         description: Group not found
 */
router.post('/:id/devices/add', groupController.addDeviceToGroup);

/**
 * @openapi
 * /groups/{id}/devices/remove:
 *   post:
 *     description: Remove devices from a group
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: Devices removed from group successfully
 *       404:
 *         description: Group not found
 */
router.post('/:id/devices/remove', groupController.removeDevicesFromGroup);

/**
 * @openapi
 * /groups/{id}:
 *   put:
 *     description: Update group details
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       404:
 *         description: Group not found
 */
router.put('/:id', groupController.updateGroup);

/**
 * @openapi
 * /groups/{id}:
 *   get:
 *     description: Get group by ID
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: Group details
 *       404:
 *         description: Group not found
 */
router.get('/:id', groupController.getGroupById);

/**
 * @openapi
 * /groups/access-control:
 *   get:
 *     description: Get groups based on access control
 *     tags:
 *       - Groups
 *     responses:
 *       200:
 *         description: List of groups based on access control
 */
router.get('/access-control', groupController.getGroupsByAccessControl);

/**
 * @openapi
 * /groups/{id}:
 *   delete:
 *     description: Delete a group
 *     tags:
 *       - Groups
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the group
 *     responses:
 *       204:
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 */
router.delete('/:id', groupController.deleteGroup);

router.post('/:id/icon', upload.single('icon'), groupController.updateIcon);

export default router;
