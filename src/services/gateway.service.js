import CustomError from "../utils/CustomError.js";
import Gateway from "../models/gateway.model.js";
import DeviceFactory from "../factories/deviceFactory.js";
import Action from "../models/action.model.js";

export const createGateway = async (gatewayData, userId) => {
  try {
    const newGateway = new Gateway({
      ...gatewayData,
      owner: userId
    })

    return newGateway;
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const getGatewayById = async (id) => {
  try {
    const gateway = await Gateway.findById(id).select("id name status");
    if (!gateway) {
      throw new CustomError("Not found", 404);
    }

    return gateway;
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const getGatewayByUser = async (userId) => {
  try {
    const gateways = await Gateway.find({ owner: userId }).select("id name status");

    if (!gateways.length) {
      throw new CustomError("No gateways found for this user", 404);
    }

    return gateways;
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const addDevice = async (deviceData, gatewayId, userId) => {
  try {
    const gateway = await Gateway.findById(gatewayId);
    if (!gateway) throw new CustomError("Gateway not found", 404);

    const device = DeviceFactory.createDevice({
      ...deviceData,
      gatewayId,
      owner: userId
    });

    await device.save();

    if (deviceData.type === "actuator" && deviceData.actions) {
      const actionsPromises = deviceData.actions.map(actionData =>
        new Action({ deviceId: device._id, ...actionData })
      );

      device.actions = await Promise.all(actionsPromises);
      await device.save();
    }

    gateway.devices.push(device._id);
    await gateway.save();

    return device;

  } catch (error) {
    throw error;
  }
}