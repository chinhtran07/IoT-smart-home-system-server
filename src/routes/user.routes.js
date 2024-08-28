const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.controllers");
const { authorize } = require("../middlewares/auth.middleware");


/**
 * @openapi
 * 
 */

router.get("/profile", userControllers.getProfile);

router.get("/me", userControllers.getCurrentUser);
router.put("/change-password", userControllers.changePassword);

router.get("/", authorize("admin"), userControllers.getAllUsers);
router.delete("/:id", authorize("admin"), userControllers.deleteUser);

module.exports = router;
