const { Device, Actuator, Sensor } = require('../models/Device');

const createDevice = async (deviceData) => {
  const { type, ...data } = deviceData;

  if (!['actuator', 'sensor'].includes(type)) {
    throw new Error('Invalid device type');
  }

  let newDevice;

  if (type === 'actuator') {
    newDevice = new Actuator(data);
  } else if (type === 'sensor') {
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
    throw new Error('Device not found');
  }
  return device;
};

const updateDevice = async (id, deviceData) => {
  const updatedDevice = await Device.findByIdAndUpdate(id, deviceData, { new: true });
  if (!updatedDevice) {
    throw new Error('Device not found');
  }
  return updatedDevice;
};

const deleteDevice = async (id) => {
  const deletedDevice = await Device.findByIdAndDelete(id);
  if (!deletedDevice) {
    throw new Error('Device not found');
  }
  return deletedDevice;
};

module.exports = { createDevice, getAllDevices, getDeviceById, updateDevice, deleteDevice };
