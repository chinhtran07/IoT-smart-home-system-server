// user.routes.js
import express from 'express';

const router = express.Router();
import * as userControllers from '../controllers/user.controllers.js';
import { authorize } from '../middlewares/auth.middleware.js';

router.post('/change-password', userControllers.changePassword);
router.get('/profile', userControllers.getProfile);
router.get('/me', userControllers.getCurrentUser);
router.get('', authorize('admin'), userControllers.getAllUsers);
router.delete('/:id', authorize('admin'), userControllers.deleteUser);
router.put('', userControllers.updateUser);

export default router;
