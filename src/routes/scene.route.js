import express from 'express';
import * as sceneController from '../controllers/scene.controller.js';

const router = express.Router();

router.post('', sceneController.createScene);
router.get('', sceneController.getScenesByUser);
router.get('/:sceneId', sceneController.getDetailScene);
router.put('/:sceneId', sceneController.updateScene);
router.delete('/:sceneId', sceneController.deleteScene);
router.patch('/:sceneId/control', sceneController.controlScene)

export default router;