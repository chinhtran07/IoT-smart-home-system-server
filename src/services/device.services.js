const AccessControl = require("../models/AccessControl");
const Device = require("../models/Device");
const Sensor = require("../models/Sensor");
const Actuator = require("../models/Actuator");
const Gateway = require("../models/Gateway");
const CustomError = require("../utils/CustomError");

const createDevice = async (deviceData) => {
    const { type, name, userId, gatewayId, macAddress, topics, configuration, ...specificData } = deviceData;
    if (!["actuator", "sensor"].includes(type)) {
      throw new CustomError("Invalid device type", 400);
    }

    const newDevice = new Device({
      userId,
      name,
      type,
      gatewayId,
      macAddress,
      topics,
      configuration
    });

    await newDevice.save();

    if (type === "actuator") {
      const actuator = new Actuator({
        deviceId: newDevice._id,
        ...specificData 
      });
      await actuator.save();
    } else if (type === "sensor") {
      const sensor = new Sensor({
        deviceId: newDevice._id,
        ...specificData 
      });
      await sensor.save();
    }
 

  return newDevice;
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
    const deviceIds = gateways.flatMap(gateway => gateway.devices);

    return await Device.find({ _id: { $in: deviceIds } });
  } catch (error) {
    throw new Error(error.message);
  }
}

const getDevicesByAccessControl = async (userId) => {
  try {
    const accessControl = await AccessControl.findOne({ userId });

    if (!accessControl) {
      throw new CustomError("Access control not found for the user.", 403);
    }

    const deviceIds = accessControl.permissions
      .filter(permission => permission.device)  
      .map(permission => permission.device);    

    const devices = await Device.find({ _id: { $in: deviceIds } });

    return devices;
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
