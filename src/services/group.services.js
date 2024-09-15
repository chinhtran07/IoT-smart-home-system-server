const mysqlDb = require('../models/mysql');
const mongoDb = require('../models/mongo');
const CustomError = require('../utils/CustomError');


const addGroup = async (name, userId, type) => {
    try {
        const newGroup = await mysqlDb.Group.create({ name, userId, type });
        return newGroup;
    } catch (error) {
        throw new Error(`Error creating group: ${error.message}`);
    }
};

const addDeviceToGroup = async (groupId, deviceIds) => {
    try {
        const group = await mysqlDb.Group.findByPk(groupId);
        if (!group) {
            throw new CustomError("Group not found", 404);
        }

        const existingDevices = await mysqlDb.DeviceGroup.findAll({
            where: { groupId },
            attributes: ['deviceId']
        });

        const existingDeviceIds = existingDevices.map(entry => entry.deviceId);

        const newDeviceIds = deviceIds.filter(deviceId => !existingDeviceIds.includes(deviceId));

        if (newDeviceIds.length === 0) {
            throw new CustomError('All devices are already in the group');
        }

        await mysqlDb.DeviceGroup.bulkCreate(
            newDeviceIds.map(deviceId => ({ deviceId, groupId })),
            { ignoreDuplicates: true }
        );

        return group;
    } catch (error) {
        throw new Error(`Error adding devices to group: ${error.message}`);
    }
};

const removeDevicesFromGroup = async (groupId, deviceIds) => {
    try {
        const group = await mysqlDb.Group.findByPk(groupId);
        if (!group) {
            throw new CustomError("Group not found", 404);
        }

        await mysqlDb.DeviceGroup.destroy({
            where: {
                groupId,
                deviceId: deviceIds
            }
        });

        return group;
    } catch (error) {
        throw new Error(`Error removing devices from group: ${error.message}`);
    }
};

const getAllGroups = async (userId) => {
    try {
        return await mysqlDb.Group.findAll({
            where: { userId }
        });
    } catch (error) {
        throw new Error(`Error fetching groups: ${error.message}`);
    }
};

const getGroupById = async (groupId) => {
    try {
        return await mysqlDb.Group.findByPk(groupId);
    } catch (error) {
        throw new Error(`Error fetching group by ID: ${error.message}`);
    }
};

const updateGroup = async (groupId, updateData) => {
    try {
        const [updated] = await mysqlDb.Group.update(updateData, {
            where: { id: groupId },
        });
        if (!updated) {
            throw new CustomError("Group not found", 404);
        }

        return updated[0];
    } catch (error) {
        throw new Error(`Error updating group: ${error.message}`);
    }
};


const deleteGroup = async (groupId) => {
    try {
        return await mysqlDb.Group.destroy({
            where: { id: groupId }
        });
    } catch (error) {
        throw new Error(`Error deleting group: ${error.message}`);
    }
};

const getGroupsByAccessControl = async (userId) => {
    try {
        const accessControl = await mongoDb.AccessControl.findOne({ userId });

        if (!accessControl) {
            const error = new Error('Access Control not found');
            error.status = 404;
            throw error;
        }

        const groupIds = accessControl.permissions
            .filter(permission => permission.group)
            .map(permission => permission.group);

        const groups = await mysqlDb.Group.findAll({
            where: {
                id: groupIds
            }
        });

        return groups;
    } catch (error) {
        throw new Error(`Error fetching groups by access control: ${error.message}`);
    }
};


module.exports = {
    addGroup,
    addDeviceToGroup,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    removeDevicesFromGroup,
    getGroupsByAccessControl
}