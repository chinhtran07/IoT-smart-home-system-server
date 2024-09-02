const AccessControl = require("../models/AccessControl");
const Device = require("../models/Device");
const Sensor = require("../models/Sensor");
const Actuator = require("../models/Actuator");
const Gateway = require("../models/Gateway");

const getAllDevices = async () => {
  return await Device.find();
};

const getDeviceById = async (id) => {
  const device = await Device.findById(id);
  if (!device) {
    const error = new Error("Not Found");
    error.status = 404;
    throw error;
  }
  return device;
};

const updateDevice = async (id, deviceData) => {
  const updatedDevice = await Device.findByIdAndUpdate(id, deviceData, {
    new: true,
  });
  if (!updatedDevice) {
    const error = new Error("Not Found");
    error.status = 404;
    throw error;
  }
  return updatedDevice;
};

const deleteDevice = async (id) => {
  const deletedDevice = await Device.findByIdAndDelete(id);
  if (!deletedDevice) {
    const error = new Error("Not Found");
    error.status = 404;
    throw error;
  }
  return deletedDevice;
};

const getDevicesOwner = async (userId) => {
  try {
    const gateways = await Gateway.find({ userId });
    const deviceIds = gateways.flatMap((gateway) => gateway.devices);

    return await Device.find({ _id: { $in: deviceIds } });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDevicesByAccessControl = async (userId) => {
  try {
    const accessControl = await AccessControl.findOne({ userId });

    if (!accessControl) {
      const error = new Error("Access control not found for the user.");
      error.status = 403;
      throw error;
    }

    const deviceIds = accessControl.permissions
      .filter((permission) => permission.device)
      .map((permission) => permission.device);

    const devices = await Device.find({ _id: { $in: deviceIds } });

    return devices;
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
