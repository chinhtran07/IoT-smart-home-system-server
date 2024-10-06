// groupRoutes.js
import express from 'express';
import * as groupController from '../controllers/group.controller.js';
import upload from '../utils/upload.js';

const router = express.Router();


router.post('', upload.single('icon'), groupController.addGroup);


router.get('', groupController.getAllGroups);

router.post('/:id/devices/add', groupController.addDeviceToGroup);

router.post('/:id/devices/remove', groupController.removeDevicesFromGroup);

router.put('/:id', groupController.updateGroup);

router.get('/:id', groupController.getGroupById);

router.get('/access-control', groupController.getGroupsByAccessControl);

router.delete('/:id', groupController.deleteGroup);

router.post('/:id/icon', upload.single('icon'), groupController.updateIcon);

export default router;
