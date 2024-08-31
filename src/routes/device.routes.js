const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/devices.controller");
const { authorize } = require("../middlewares/auth.middleware");
const deviceAccess = require("../middlewares/deviceAccess.middleware");

router.get("", authorize(["admin"]), deviceController.getAllDevices);
router.get("/:deviceId", deviceAccess, deviceController.getDeviceById);
router.put("/:deviceId", deviceAccess, deviceController.updateDevice);
router.delete("/:deviceId", deviceAccess, deviceController.deleteDevice);

module.exports = router;