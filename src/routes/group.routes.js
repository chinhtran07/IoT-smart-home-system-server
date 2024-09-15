const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');

router.post('', groupController.addGroup);
router.get('', groupController.getAllGroups);
router.post('/:id/devices/add', groupController.addDeviceToGroup)
router.post('/:id/devices/remove', groupController.removeDevicesFromGroup)
router.put('/:id', groupController.updateGroup);
router.get('/:id', groupController.getGroupById);
router.get('/access-control', groupController.getGroupsByAccessControl);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;