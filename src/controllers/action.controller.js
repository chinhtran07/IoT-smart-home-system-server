import { getActionsbyDevice } from "../services/action.service.js";

export const getActionsByDevice = async (req, res, next) => {
    try {
        const deviceId = req.query.deviceId;
        const actions = await getActionsbyDevice(deviceId);

        res.json(actions);
    } catch (error) {
        next(error);
    }
}