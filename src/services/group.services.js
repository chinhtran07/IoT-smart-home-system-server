const AccessControl = require('../models/AccessControl');
const Group = require('../models/Group');


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
            const error = new Error('Not Found');
            error.status = 404;
            throw error;
        }
        
        const newDeviceIds = devices.filter(deviceId => group.devices.includes(deviceId));
        if (newDeviceIds.length > 0) {
            group.devices.push(...newDeviceIds);
            return await group.save();
        } else {
            throw new Error('All devices are already in the group');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const removeDevicesFromGroup = async (groupId, devices) => {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            const error = new Error('Not Found');
            error.status = 404;
            throw error;
        }

        // Loại bỏ các thiết bị khỏi danh sách deviceIds
        const deviceIds = devices.filter(deviceId => !group.devices.includes(deviceId));
        
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
        return await Group.findById(groupId);
    } catch (error) {
        throw new Error('Error fetching device group by ID: ' + error.message);
    }
}

const updateGroup = async (groupId, updateData) => {
    try {
        return await Group.findByIdAndUpdate(groupId, updateData, { new: true });
    } catch (error) {
        throw new Error('Error updating device group: ' + error.message);
    }
}

const deleteGroup = async (groupId) => {
    try {
        return await Group.findByIdAndDelete(groupId);
    } catch (error) {
        throw new Error('Error deleting device group: ' + error.message);
    }
}

const getGroupsByAccessControl = async (userId) => {
    try {
        const accessControl = await AccessControl.findOne({ userId });

        if (!accessControl) {
            const error = new Error('Not Found');
            error.status = 404;
            throw error;
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