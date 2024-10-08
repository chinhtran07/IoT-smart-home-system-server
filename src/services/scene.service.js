import CustomError from "../utils/CustomError.js";
import Scene from "../models/scene.model.js";
import { controlDevice } from "./control.service.js";

// Utility function to handle transactions
const withTransaction = async (callback) => {
  const session = await Scene.startSession();
  session.startTransaction();
  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw new CustomError(error.message);
  } finally {
    session.endSession();
  }
};

// Create a new scene and associate actions
export const createScene = async (userId, name, description, actions = []) => {
  return withTransaction(async (session) => {
    const newScene = new Scene({ userId, name, description, actions }, { session });
    return newScene; 
  });
};

// Get all scenes for a user and include associated actions
export const getScenesByUser = async (userId) => {
  try {
    return await Scene.find({ userId }).populate("actions");
  } catch (error) {
    throw new CustomError(error.message);
  }
};

// Get detailed scene information by sceneId
export const getDetailScene = async (sceneId) => {
  try {
    const scene = await Scene.findById(sceneId).populate("actions");
    if (!scene) throw new CustomError("Scene not found", 404);
    return scene;
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const updateScene = async (sceneId, updateData) => {
    return withTransaction(async (session) => {
      const scene = await Scene.findById(sceneId).session(session);
      if (!scene) throw new CustomError("Scene not found", 404);
  
      const { actions: newActionIds = [], ...otherUpdates } = updateData;
      Object.assign(scene, otherUpdates);
  
      if (newActionIds.length > 0) {
        const currentActionSet = new Set(scene.actions.map(String));
  
        const actionsToAdd = newActionIds.filter(id => !currentActionSet.has(id));
        const actionsToKeep = newActionIds.filter(id => currentActionSet.has(id));
  
        scene.actions = [...actionsToKeep, ...actionsToAdd];
      }
  
      await scene.save({ session });
      return scene;
    });
  };
  

// Delete a scene and its associated actions
export const deleteScene = async (sceneId) => {
  return withTransaction(async (session) => {
    const scene = await Scene.findByIdAndDelete(sceneId, { session });
    if (!scene) throw new CustomError("Scene not found", 404);
  });
};

// Toggle the active state of a scene
export const controlScene = async (sceneId) => {
  try {
    // Tìm scene theo ID và lấy actions
    const scene = await Scene.findById(sceneId).populate("actions", "id deviceId property value");
    if (!scene) throw new CustomError("Scene not found", 404);

    const controlPromises = scene.actions.map(({ deviceId, property, value }) => {
      const command = { [property]: value }; 

      return controlDevice(deviceId, command); 
    });

    const results = await Promise.allSettled(controlPromises);

    // Xử lý kết quả
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Error controlling device:", result.reason);
      }
    });

    return scene;
  } catch (error) {
    throw new CustomError(error.message);
  }
};
