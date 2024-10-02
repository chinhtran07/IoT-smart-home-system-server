// authRoutes.js
import express from 'express';
import * as authControllers from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     description: Login
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authControllers.loginUser);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     description: Register a new user
 *     tags:
 *       - Auth
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', authControllers.registerUser);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     description: Refresh the user token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh-token', authControllers.refreshToken);

export default router;
