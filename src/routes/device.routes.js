const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/devices.controller");
const { authorize } = require("../middlewares/auth.middleware");
const deviceAccess = require("../middlewares/deviceAccess.middleware");

router.get("", authorize(["admin"]), deviceController.getAllDevices);
router.get("/owner", deviceController.getDevicesOwner);
router.get("/access-control", deviceController.getDevicesByAccessControl);
router.get("/:id", deviceAccess, deviceController.getDeviceById);
router.put("/:id", deviceAccess, deviceController.updateDevice);
router.delete("/:id", deviceAccess, deviceController.deleteDevice);


module.exports = router;