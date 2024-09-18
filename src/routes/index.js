const express = require('express');
const router = express.Router();

router.use('/gateways', require('./gateway.routes'));
router.use('/users', require('./user.routes'));
router.use('/devices', require('./device.routes'));
router.use('/schedules', require('./schedule.routes'));
router.use('/scenarios', require('./scenario.routes'));
router.use('/control', require('./control.routes'));
router.use('/access-control', require('./accessControl.routes'));
router.use('/groups', require('./group.routes'));

module.exports = router;