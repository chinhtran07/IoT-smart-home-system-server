const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');

router.post('', groupController.addGroup);
router.put('/:id/devices/add', groupController.addDeviceToGroup)
router.put('/:id/devices/remove', groupController.removeDevicesFromGroup)
router.put('/:id', groupController.updateGroup);
router.patch('/:id', groupController.updateGroup);
router.get('', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);
router.get('/access-control', groupController.getGroupsByAccessControl);

module.exports = router;