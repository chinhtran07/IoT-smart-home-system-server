const AccessControl = require("../models/AccessControl");
const { Device, Actuator, Sensor } = require("../models/Device");
const Gateway = require("../models/Gateway");
const CustomError = require("../utils/CustomError");

const createDevice = async (deviceData) => {
  const { type, ...data } = deviceData;

  if (!["actuator", "sensor"].includes(type)) {
    throw new CustomError("Invalid device type", 400);
  }

  let newDevice;

  if (type === "actuator") {
    newDevice = new Actuator(data);
  } else if (type === "sensor") {
    newDevice = new Sensor(data);
  }

  return await newDevice.save();
};

const getAllDevices = async () => {
  return await Device.find();
};

const getDeviceById = async (id) => {
  const device = await Device.findById(id);
  if (!device) {
    throw new CustomError("Device not found", 404);
  }
  return device;
};

const updateDevice = async (id, deviceData) => {
  const updatedDevice = await Device.findByIdAndUpdate(id, deviceData, {
    new: true,
  });
  if (!updatedDevice) {
    throw new CustomError("Device not found", 404);
  }
  return updatedDevice;
};

const deleteDevice = async (id) => {
  const deletedDevice = await Device.findByIdAndDelete(id);
  if (!deletedDevice) {
    throw new CustomError("Device not found", 404);
  }
  return deletedDevice;
};


const getDevicesOwner = async (userId) => {
  try {
    const gateways = await Gateway.find({ userId });
    const deviceIds = gateways.flatMap(gateway => gateway.deviceIds);

    return await Device.find({ _id: { $in: deviceIds } });
  } catch (error) {
    throw new Error(error.message);
  }
}

const getDevicesByAccessControl = async (userId) => {
  try {
    const accessControl = await AccessControl.findOne({ userId });
    const deviceIds = accessControl.map(ac => ac.deviceId);
    
    return await Device.find({ _id: { $in: deviceIds } });
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDevicesByAccessControl,
  getDevicesOwner,
};
