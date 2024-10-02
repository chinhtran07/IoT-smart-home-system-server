import * as sceneService from '../services/scene.service.js';

export const createScene = async (req, res, next) => {
    const { name, description, actions } = req.body;
    const userId = req.user.id; // Retrieve userId from req.user.id

    try {
        const newScene = await sceneService.createScene(userId, name, description, actions);
        res.status(201).json(newScene);
    } catch (error) {
        next(error);
    }
};

export const getScenesByUser = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const scenes = await sceneService.getScenesByUser(userId);
        res.status(200).json(scenes);
    } catch (error) {
        next(error);
    }
};

export const getDetailScene = async (req, res, next) => {
    const { sceneId } = req.params;

    try {
        const scene = await sceneService.getDetailScene(sceneId);
        res.status(200).json(scene);
    } catch (error) {
        next(error);
    }
};

export const updateScene = async (req, res, next) => {
    const { sceneId } = req.params;
    const { updates, newActionIds } = req.body;

    try {
        const updatedScene = await sceneService.updateScene(sceneId, updates, newActionIds);
        res.status(200).json(updatedScene);
    } catch (error) {
        next(error);
    }
};

export const deleteScene = async (req, res, next) => {
    const { sceneId } = req.params;

    try {
        await sceneService.deleteScene(sceneId);
        res.status(204).send(); // No content
    } catch (error) {
        next(error);
    }
};

export const controlScene = async (req, res, next) => {
    const { sceneId } = req.params;

    try {
        const updatedScene = await sceneService.controlScene(sceneId);
        res.status(200).json(updatedScene);
    } catch (error) {
        next(error);
    }
};
