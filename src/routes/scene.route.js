import express from 'express';
import * as sceneController from '../controllers/scene.controller.js';

const router = express.Router();

router.post('/scenes', sceneController.createScene);
router.get('/scenes/user/:userId', sceneController.getScenesByUser);
router.get('/scenes/:sceneId', sceneController.getDetailScene);
router.put('/scenes/:sceneId', sceneController.updateScene);
router.delete('/scenes/:sceneId', sceneController.deleteScene);
router.patch('/scenes/:sceneId/control', sceneController.controlScene)

export default router;