import CustomError from "../utils/CustomError.js"
import db from "../models/mysql/index.js";

export const createScene = async (userId, name, description, actions) => {
    const transaction = await db.sequelize.transaction();
    try {
        const newScene = await db.Scene.create({
            name,
            description,
            userId,
        });

        if (actions && actions.length > 0) {
            const actionSceneData = actions.map(actionId => ({
                actionId,
                sceneId: newScene.id,
            }));

            await db.ActionScene.bulkCreate(actionSceneData, {transaction});
        }

        await transaction.commit();
        return newScene;
    } catch (error) {
        await transaction.rollback();
        throw new CustomError(error.message);
    }
};

export const getScenesByUser = async (userId) => {
    try {
        const scenes = await db.Scene.findAll({
            where: { userId },
            include: {
                model: db.ActionScene,
                include: [db.Action], 
            },
        });

        return scenes;
    } catch (error) {
        throw new CustomError(error.message);
    }
};


export const getDetailScene = async (sceneId) => {
    try {
        const scene = await db.Scene.findOne({
            where: { id: sceneId },
            include: {
                model: db.scene_actions,
                include: [db.Action],
            },
        });

        if (!scene) {
            throw new CustomError('Scene not found', 404);
        }

        return scene;
    } catch (error) {
        throw new CustomError(error.message);
    }
};

export const updateScene = async (sceneId, updates, newActionIds) => {
    const transaction = await db.sequelize.transaction(); 
    try {
        const [updatedCount, [updatedScene]] = await db.Scene.update(updates, {
            where: { id: sceneId },
            returning: true,
            transaction, 
        });

        if (updatedCount === 0) {
            throw new CustomError('Scene not found or no changes made');
        }

        const currentActions = await db.ActionScene.findAll({
            where: { sceneId: updatedScene.id },
            attributes: ['actionId'],
            transaction,
        });

        const currentActionIds = currentActions.map(action => action.actionId);

        const actionIdsToAdd = newActionIds.filter(actionId => !currentActionIds.includes(actionId));
        const actionIdsToRemove = currentActionIds.filter(actionId => !newActionIds.includes(actionId));

        if (actionIdsToAdd.length > 0) {
            await db.ActionScene.bulkCreate(actionIdsToAdd.map(actionId => ({
                sceneId: updatedScene.id,
                actionId,
            })), { transaction });
        }

        if (actionIdsToRemove.length > 0) {
            await db.ActionScene.destroy({
                where: {
                    sceneId: updatedScene.id,
                    actionId: actionIdsToRemove,
                },
                transaction,
            });
        }

        await transaction.commit(); 
        return updatedScene;
    } catch (error) {
        await transaction.rollback();
        throw new CustomError(error.message);
    }
};

export const deleteScene = async (sceneId) => {
    const transaction = await db.sequelize.transaction(); 

    try {
        await db.scene_actions.destroy({
            where: { sceneId },
            transaction,
        });

        const deletedCount = await db.Scene.destroy({
            where: { id: sceneId },
            transaction,
        });

        if (deletedCount === 0) {
            throw new CustomError('Scene not found', 404);
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new CustomError(error.message);
    }
};

export const controlScene = async (sceneId) => {
    try {
        const scene = await db.Scene.findByPk(sceneId);

        scene.active = !scene.active;

        await scene.save();
        return scene;
    } catch (error) {
        throw new CustomError(error.message);
    }
}