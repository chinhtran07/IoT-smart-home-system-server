import AccessControl from "../models/accessControl.model.js";
import Device from "../models/device.model.js";
import Group from "../models/group.model.js";
import CustomError from "../utils/CustomError.js";
import uploadCloudinary from "../utils/uploadCloudinary.js";

export const addGroup = async (name, userId, file) => {
  try {
    const url = await uploadCloudinary(file);
    const newGroup = new Group({ name, userId, icon: url });
    return newGroup;
  } catch (error) {
    throw new CustomError(`Error creating group: ${error.message}`);
  }
};

export const addDevicesToGroup = async (groupId, deviceIds) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new CustomError("Group not found", 404);
    }

    const newDeviceIds = deviceIds.filter(
      (deviceId) => !group.devices.includes(deviceId)
    );

    if (newDeviceIds.length === 0) {
      throw new CustomError("All devices are already in the group", 409);
    }

    group.devices.push(...newDeviceIds);
    await group.save();

    await Device.updateMany(
      { _id: { $in: newDeviceIds } },
      { $addToSet: { groups: groupId } }
    );

    return group;
  } catch (error) {
    throw new CustomError(`Error adding devices to group: ${error.message}`);
  }
};

export const removeDevicesFromGroup = async (groupId, deviceIds) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new CustomError("Group not found", 404);
    }

    const devices = await Device.find({ _id: { $in: deviceIds } });
    if (devices.length !== deviceIds.length) {
      throw new CustomError("One or more devices not found", 404);
    }

    group.devices = group.devices.filter(
      (id) => !deviceIds.includes(id.toString())
    );
    await group.save();

    await Device.updateMany(
      { _id: { $in: deviceIds } },
      { $pull: { groups: groupId } }
    );

    return group;
  } catch (error) {
    throw new CustomError(
      `Error removing devices from group: ${error.message}`
    );
  }
};

export const getAllGroups = async (userId) => {
  try {
    const groups = await Group.find({ userId });
    return groups;
  } catch (error) {
    throw new CustomError(`Error fetching groups: ${error.message}`);
  }
};

export const getGroupById = async (groupId) => {
  try {
    const group = await Group.findById(groupId);

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
    const group = await Group.findByIdAndUpdate(groupId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!group) {
      throw new CustomError("Group not found", 404);
    }

    return group;
  } catch (error) {
    throw new CustomError(`Error updating group: ${error.message}`);
  }
};

export const deleteGroup = async (groupId) => {
  try {
    const deleted = await Group.findByIdAndDelete(groupId);
    if (!deleted) {
      throw new CustomError("Group not found", 404);
    }
  } catch (error) {
    throw new CustomError(`Error deleting group: ${error.message}`);
  }
};

export const getGroupsByAccessControl = async (userId) => {
  try {
    const accessControl = await AccessControl.findOne({ userId });

    if (!accessControl) {
      throw new CustomError("Access Control not found", 404);
    }

    const groupIds = accessControl.permissions
      .filter((permission) => permission.group)
      .map((permission) => permission.group);

    const groups = await Group.find({
      _id: { $in: groupIds },
    });

    return groups;
  } catch (error) {
    throw new CustomError(
      `Error fetching groups by access control: ${error.message}`
    );
  }
};

export const uploadIcon = async (groupId, file) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new CustomError("User not found", 404);
    }

    const icon = await uploadCloudinary(file);

    group.icon = icon;
    await group.save();
    return icon;
  } catch (error) {
    throw error;
  }
};
