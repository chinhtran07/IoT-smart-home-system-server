const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.controllers");
const { authorize } = require("../middlewares/auth.middleware");

router.post("/change-password", userControllers.changePassword);
router.get("/profile", userControllers.getProfile);
router.get("/me", userControllers.getCurrentUser);
router.get("", authorize("admin"), userControllers.getAllUsers);
router.delete("/:id", authorize("admin"), userControllers.deleteUser);
router.put("", userControllers.updateUser);

module.exports = router;
