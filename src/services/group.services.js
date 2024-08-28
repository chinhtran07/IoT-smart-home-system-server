const AccessControl = require('../models/AccessControl');
const Group = require('../models/Group');
const CustomError = require('../utils/CustomError');


const addGroup = async (name, userId, devices, type) => {

    try {
        const newGroup = new Group({ name, userId, devices, type });
        return await newGroup.save();
    } catch (error) {
        throw new Error(error.message);
    }
};

const addDeviceToGroup = async (groupId, devices) => {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new CustomError('Not Found', 404);
        }
        
        const newDeviceIds = devices.filter(deviceId => group.devices.includes(deviceId));
        if (newDeviceIds.length > 0) {
            group.devices.push(...newDeviceIds);
            return await group.save();
        } else {
            throw new CustomError('All devices are already in the group', 400);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const removeDevicesFromGroup = async (groupId, deviceIds) => {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new CustomError('Group not found', 404);
        }

        // Loại bỏ các thiết bị khỏi danh sách deviceIds
        group.deviceIds = group.devices.filter(device => !devices.includes(device));
        
        return await group.save();
    } catch (error) {
        throw new Error('Error removing devices from group: ' + error.message);
    }
}

const getAllGroups = async (userId) => {
    try {
        return await Group.find({ userId });    
    } catch (error) {
        throw new CustomError(error.message);
    }
} 


const getGroupById = async (groupId) => {
    try {
        return await DeviceGroup.findById(groupId);
    } catch (error) {
        throw new Error('Error fetching device group by ID: ' + error.message);
    }
}

const updateGroup = async (groupId, updateData) => {
    try {
        return await DeviceGroup.findByIdAndUpdate(groupId, updateData, { new: true });
    } catch (error) {
        throw new Error('Error updating device group: ' + error.message);
    }
}

const deleteGroup = async (groupId) => {
    try {
        return await DeviceGroup.findByIdAndDelete(groupId);
    } catch (error) {
        throw new Error('Error deleting device group: ' + error.message);
    }
}

const getGroupsByAccessControl = async (userId) => {
    try {
        const accessControl = await AccessControl.findOne({ userId });

        if (!accessControl) {
            throw new Error("Access control not found for the user.");
        }
        
        const groupIds = accessControl.permissions.filter(permission => permission.group).map(permission => permission.group);

        const groups = await Group.find({ _id: { $in: groupIds } });

        return groups;
    } catch (error) {
        throw new Error(error.message);
    }
}

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