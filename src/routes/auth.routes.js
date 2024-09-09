const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");

/**
 * @openapi
 * /auth/login
 * post:
 *  description: login
 *  tags:
 *  - Auth
 * 
 */

router.post("/login", authControllers.loginUser);

router.post("/register", authControllers.registerUser);

module.exports = router;
