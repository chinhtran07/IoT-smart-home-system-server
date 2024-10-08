import CustomError from "../utils/CustomError.js";
import Device from "../models/device.model.js";
import AccessControl from "../models/accessControl.model.js";
import mongoose from "mongoose";

export const getAllDevices = async () => {
  try {
    return await Device.find(); // Fetch all devices
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const getDeviceById = async (id) => {
  try {
    const device = await Device.findById(id);
    if (!device) {
      throw new CustomError("Device not found", 404);
    }
    return device;
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const updateDevice = async (id, dataToUpdate) => {
  try {
    const device = await Device.findById(id);
    if (!device) {
      throw new CustomError("Device not found", 404);
    }
    const updatedDevice = await device.updateOne(dataToUpdate); // Update the device
    return updatedDevice;
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const deleteDevice = async (id) => {
  try {
    const device = await Device.findById(id);
    if (!device) {
      throw new CustomError("Device not found", 404);
    }
    await device.deleteOne(); // Delete the device
    return { message: "Device deleted successfully" };
  } catch (error) {
    throw new CustomError(error.message);
  }
};
export const getDevicesOwner = async (userId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    // Convert userId to ObjectId
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const [result] = await Device.aggregate([
      { $match: { owner: objectIdUserId } },
      {
        $facet: {
          devices: [
            { $skip: offset },
            { $limit: limit },
            { $project: { _id: 1, name: 1, type: 1, status: 1 } },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const total =result?.totalCount?.length > 0 ? result.totalCount[0].count : 0;
    const totalPages = Math.ceil(total / limit);

    console.log(result);

    return {
      total,
      devices: result.devices || [],
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const getDevicesByAccessControl = async (
  userId,
  page = 1,
  limit = 10
) => {
  try {
    const accessControl = await AccessControl.findOne({ userId });
    if (!accessControl) {
      throw new CustomError("Access control not found for the user.", 403);
    }

    const deviceIds = accessControl.permissions
      .filter((permission) => permission.device)
      .map((permission) => permission.device);

    const offset = (page - 1) * limit;

    const devices = await Device.find({ _id: { $in: deviceIds } })
      .skip(offset)
      .limit(limit);

    const count = await Device.countDocuments({ _id: { $in: deviceIds } });

    return {
      total: count,
      devices,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export default {
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDevicesByAccessControl,
  getDevicesOwner,
};
