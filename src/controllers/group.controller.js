const groupService = require('../services/group.services');

const addGroup = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { name, type } = req.body;
        const newGroup = await groupService.addGroup(name, userId, type);
        res.status(201).json(newGroup);
    } catch (error) {
        next(error);
    }
}

const addDeviceToGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const {deviceIds} = req.body;
        await groupService.addDeviceToGroup(groupId, deviceIds);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

const removeDevicesFromGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const {deviceIds} = req.body;
        await groupService.removeDevicesFromGroup(groupId, deviceIds);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

const getAllGroups = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const groups = await groupService.getAllGroups(userId);
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }

}

const getGroupById = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const group = await groupService.getGroupById(groupId);
        res.status(200).json(group);
    } catch (error) {
        next(error);
    }
}

const getGroupsByAccessControl = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const groups = await groupService.getGroupsByAccessControl(userId);
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
}

const updateGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const updateData = req.body;
        await groupService.updateGroup(groupId, updateData);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

const deleteGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        await groupService.deleteGroup(groupId);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addGroup,
    addDeviceToGroup,
    getAllGroups,
    getGroupById,
    getGroupsByAccessControl,
    updateGroup,
    deleteGroup,
    removeDevicesFromGroup
}