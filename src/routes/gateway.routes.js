const express = require("express");
const router = express.Router();
const gatewayController = require('../controllers/gateway.controller');

router.post("", gatewayController.createGateway);
router.post('/:id/devices', gatewayController.addDevice);
router.get('/user', gatewayController.getGatewaysByUser);
router.get('/:id', gatewayController.getGatewayById);

module.exports = router;