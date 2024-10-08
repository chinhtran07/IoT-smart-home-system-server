import db from "../models/index.js";

export const getActionsbyDevice = async (deviceId) => {
    try {
        const actions = await db.Action.find({ deviceId }).select('id description');
        return actions;
    } catch (error) {
        throw error;
    }
}