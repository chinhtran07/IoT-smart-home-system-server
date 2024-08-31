const express = require("express");
const router = express.Router();
const gatewayController = require('../controllers/gateway.controller');

router.post('', gatewayController.createGateway);
router.post('/:id/devices', gatewayController.addDevice);

module.exports = router;