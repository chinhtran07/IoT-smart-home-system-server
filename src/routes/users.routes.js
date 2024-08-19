const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/current-user', authMiddleware.authenticateToken, userController.getCurrentUser);

module.exports = router;