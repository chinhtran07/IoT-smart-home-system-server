import mysqlDb from '../models/mysql/index.js';
import mongoDb from '../models/mongo/index.js';
import CustomError from '../utils/CustomError.js';

export const getAllDevices = async () => {
  try {
    return await mysqlDb.Device.findAll();
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const getDeviceById = async (id) => {
  try {
    const device = await mysqlDb.Device.findByPk(id);
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
    const device = await mysqlDb.Device.findByPk(id);
    if (!device) {
      throw new CustomError("Device not found", 404);
    }
    const updatedDevice = await device.update(dataToUpdate);
    return updatedDevice; 
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const deleteDevice = async (id) => {
  try {
    const device = await mysqlDb.Device.findByPk(id);
    if (!device) {
      throw new CustomError("Device not found", 404);
    }
    await device.destroy();
    return { message: "Device deleted successfully" };
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const getDevicesOwner = async (userId, page = 1, limit = 10) => {
  try {
    const gateways = await mysqlDb.Gateway.findAll({ where: { userId } });
    const gatewayIds = gateways.map(gateway => gateway.id);
    const offset = (page - 1) * limit;

    const { count, rows } = await mysqlDb.Device.findAndCountAll({
      where: { gatewayId: gatewayIds },
      limit,
      offset,
      attributes: ['id', 'name', 'type', 'status']
    });

    return {
      total: count,
      devices: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const getDevicesByAccessControl = async (userId, page = 1, limit = 10) => {
  try {
    const accessControl = await mongoDb.AccessControl.findOne({ userId });
    if (!accessControl) {
      throw new CustomError("Access control not found for the user.", 403);
    }

    const deviceIds = accessControl.permissions
      .filter(permission => permission.device)
      .map(permission => permission.device);

    const offset = (page - 1) * limit;

    const { count, rows } = await mysqlDb.Device.findAndCountAll({
      where: { id: deviceIds },
      limit,
      offset,
    });

    return {
      total: count,
      devices: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
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
