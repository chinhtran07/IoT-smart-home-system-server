const express = require("express");
const router = express.Router();
const accessControlController = require("../controllers/accessControl.controller");

router.post("/grant", accessControlController.grantPermission);
router.get("/:userId", accessControlController.getAccessControl);
router.get("", accessControlController.getGrantedUsersByOwner);
router.put("/grant/:userId", accessControlController.updateAccessControl);
router.delete("/revoke", accessControlController.deleteAccessControl);

module.exports = router;
