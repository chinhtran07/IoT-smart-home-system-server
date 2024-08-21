const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user.controllers');

router.get('/profile', userControllers.getProfile);
router.get('/me', userControllers.getCurrentUser);

module.exports = router;
