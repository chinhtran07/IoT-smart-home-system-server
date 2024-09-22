import mysqlDB from "../models/mysql/index.js";
import mongoDb from "../models/mongo/index.js";
import CustomError from "../utils/CustomError.js";

export const createGateway = async (gatewayData, userId) => {
  try {
    const { name, macAddress, ipAddress, status } = gatewayData;

    const newGateway = await mysqlDB.Gateway.create({
      name,
      ipAddress,
      macAddress,
      status,
      userId,
    });

    return newGateway;
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const addDevice = async (deviceData, gatewayId, userId) => {
  const transaction = await mysqlDB.sequelize.transaction();
  try {
    const gateway = await mysqlDB.Gateway.findByPk(gatewayId, { transaction });
    if (!gateway) {
      throw new CustomError("Gateway not found", 404);
    }

    const { type, name, macAddress, topics, detail, actions } = deviceData;
    if (!["actuator", "sensor"].includes(type)) {
      throw new CustomError("Invalid device type", 400);
    }

    const existingDevice = await mysqlDB.Device.findOne({
      where: { macAddress },
      transaction,
    });
    if (existingDevice) {
      throw new CustomError("Device with this MAC address already exists", 409);
    }

    const newDevice = await mysqlDB.Device.create(
      {
        userId,
        name,
        type,
        gatewayId,
        macAddress,
      },
      { transaction }
    );

    if (type === "actuator") {
      const { type: actuatorType, ...others } = detail;
      await mysqlDB.Actuator.create(
        {
          type: actuatorType,
          properties: others,
          id: newDevice.id,
        },
        { transaction }
      );

      if (actions && actions.length > 0) {
        await Promise.all(
          actions.map((action) =>
            mysqlDB.Action.create(
              {
                ...action,
                deviceId: newDevice.id,
              },
              { transaction }
            )
          )
        );
      }
    } else if (type === "sensor") {
      await mysqlDB.Sensor.create(
        {
          ...detail,
          id: newDevice.id,
        },
        { transaction }
      );
    }

    const topic = new mongoDb.Topic({
      deviceId: newDevice.id,
      topics: topics,
    });

    await topic.save();

    await transaction.commit();
    return newDevice;
  } catch (error) {
    await transaction.rollback();
    throw new CustomError(error.message);
  }
};

export const getGatewayById = async (id) => {
  try {
    const gateway = await mysqlDB.Gateway.findByPk(id, {
      attributes: ["id", "name", "status"],
    });
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
    const gateways = await mysqlDB.Gateway.findAll(
      { where: { userId } },
      {
        attributes: ["id", "name", "status"],
      }
    );
    if (!gateways.length) {
      throw new CustomError("No gateways found for this user", 404);
    }

    return gateways;
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export default {
  createGateway,
  addDevice,
  getGatewayById,
  getGatewayByUser,
};
