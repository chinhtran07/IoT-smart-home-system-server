const controlController = require('../controllers/control.controller');
const express = require('express');
const router = express.Router();

router.post('', require('../middlewares/deviceAccess.middleware')  ,controlController.controlDevice);

module.exports = router;