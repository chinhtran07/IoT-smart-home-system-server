import mysqlDb from '../models/mysql/index.js';
import mongoDb from '../models/mongo/index.js';
import CustomError from '../utils/CustomError.js';

export const addGroup = async (name, userId, type) => {
    try {
        const newGroup = await mysqlDb.Group.create({ name, userId, type });
        return newGroup;
    } catch (error) {
        throw new CustomError(`Error creating group: ${error.message}`);
    }
};

export const addDeviceToGroup = async (groupId, deviceIds) => {
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
            throw new CustomError('All devices are already in the group', 409);
        }

        await mysqlDb.DeviceGroup.bulkCreate(
            newDeviceIds.map(deviceId => ({ deviceId, groupId })),
            { ignoreDuplicates: true }
        );

        return group;
    } catch (error) {
        throw new CustomError(`Error adding devices to group: ${error.message}`);
    }
};

export const removeDevicesFromGroup = async (groupId, deviceIds) => {
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
        throw new CustomError(`Error removing devices from group: ${error.message}`);
    }
};

export const getAllGroups = async (userId) => {
    try {
        return await mysqlDb.Group.findAll({
            where: { userId }
        });
    } catch (error) {
        throw new CustomError(`Error fetching groups: ${error.message}`);
    }
};

export const getGroupById = async (groupId) => {
    try {
        const group = await mysqlDb.Group.findByPk(groupId);
        if (!group) {
            throw new CustomError("Group not found", 404);
        }
        return group;
    } catch (error) {
        throw new CustomError(`Error fetching group by ID: ${error.message}`);
    }
};

export const updateGroup = async (groupId, updateData) => {
    try {
        const [updated] = await mysqlDb.Group.update(updateData, {
            where: { id: groupId },
        });
        if (!updated) {
            throw new CustomError("Group not found", 404);
        }

        return updated[0];
    } catch (error) {
        throw new CustomError(`Error updating group: ${error.message}`);
    }
};

export const deleteGroup = async (groupId) => {
    try {
        const deleted = await mysqlDb.Group.destroy({
            where: { id: groupId }
        });
        if (!deleted) {
            throw new CustomError("Group not found", 404);
        }
        return { message: "Group deleted successfully" };
    } catch (error) {
        throw new CustomError(`Error deleting group: ${error.message}`);
    }
};

export const getGroupsByAccessControl = async (userId) => {
    try {
        const accessControl = await mongoDb.AccessControl.findOne({ userId });

        if (!accessControl) {
            throw new CustomError('Access Control not found', 404);
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
        throw new CustomError(`Error fetching groups by access control: ${error.message}`);
    }
};

export const uploadIcon = async (groupId, file) => {
    try {
        const group = await mysqlDb.Group.findByPk(groupId);
        if (!group) {
          throw new CustomError("User not found", 404);
        }
    
        const uploadResponse = await cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            throw new CustomError("Failed to upload image to Cloudinary", 500);
          }
          return result.secure_url;
        });
        file.stream.pipe(uploadResponse);
    
        const icon = await new Promise((resolve, reject) => {
          uploadResponse.on("finish", () => resolve(uploadResponse.url));
          uploadResponse.on("error", reject);
        });
    
        group.icon = icon;
        await group.save();
        return avatarURI;
      } catch (error) {
        throw error;
      }
}