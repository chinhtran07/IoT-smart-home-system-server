const mysqlDb = require('../models/mysql');
const mongoDb = require('../models/mongo');

const getAllDevices = async () => {
  try {
    return await mysqlDb.Device.findAll();
  } catch (error) {
    throw error;
  }
};


const getDeviceById = async (id) => {
  try {
    const device = await mysqlDb.Device.findByPk(id);
    if (!device) {
      const error = new Error("Device not found");
      error.status = 404;
      throw error;
    }
    return device;
  } catch (error) {
    throw error;
  }
};

const updateDevice = async (id, dataToUpdate) => {
  try {
      const device = await mysqlDb.Device.findByPk(id);

      // Nếu thiết bị không tồn tại, ném lỗi
      if (!device) {
          const error = new Error("Device not found");
          error.status = 404;
          throw error;
      }

      const updatedDevice = await device.update(dataToUpdate);

      return updatedDevice; 
  } catch (error) {
      throw error;
  }
};



const deleteDevice = async (id) => {
  try {
    const device = await mysqlDb.Device.findByPk(id);
    if (!device) {
      const error = new Error("Device not found");
      error.status = 404;
      throw error;
    }
    await device.destroy();
    return { message: "Device deleted successfully" };
  } catch (error) {
    throw error;
  }
};

const getDevicesOwner = async (userId, page = 1, limit = 10) => {
  try {
    const gateways = await mysqlDb.Gateway.findAll({ userId: userId });

    const gatewayIds = gateways.map(gateway => gateway.id);

    const offset = (page - 1) * limit;

    const { count, rows } = await mysqlDb.Device.findAndCountAll({
      where: {
        gatewayId: gatewayIds
      },
      limit: limit,
      offset: offset,
      attributes: ['id', 'name', 'type', 'status']
    });

    return {
      total: count,
      devices: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDevicesByAccessControl = async (userId, page = 1, limit = 10) => {
  try {
    const accessControl = await mongoDb.AccessControl.findOne({ userId });

    if (!accessControl) {
      const error = new Error("Access control not found for the user.");
      error.status = 403;
      throw error;
    }

    const deviceIds = accessControl.permissions
      .filter(permission => permission.device)
      .map(permission => permission.device);

    const offset = (page - 1) * limit;

    const { count, rows } = await mysqlDb.Device.findAndCountAll({
      where: {
        id: deviceIds
      },
      limit: limit,
      offset: offset,
    });

    return {
      total: count,
      devices: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDevicesByAccessControl,
  getDevicesOwner,
};
