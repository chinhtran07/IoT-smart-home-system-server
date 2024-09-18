const mysqlDb = require("../models/mysql");
const mongoDb = require("../models/mongo");
const CustomError = require("../utils/CustomError");
const myEmitter = require("../events/eventsEmitter");
const { publishControlMessage } = require("../mqtt/mqttControl");

const controlDevice = async (deviceId, command) => {
  try {
    const device = await mysqlDb.Device.findByPk(deviceId, {
      attributes: ["gatewayId"],
    });

    const actuator = await mysqlDb.Actuator.findByPk(deviceId);

    if (!device || !actuator) {
      throw new CustomError("Actuator or Device not found", 404);
    }

    const invalidKeys = Object.keys(command).filter(
      (key) => !(key in actuator.properties)
    );

    if (invalidKeys.length > 0) {
      throw new CustomError(
        `Invalid command keys: ${invalidKeys.join(", ")}`,
        404
      );
    }

    const topic = await mongoDb.Topic.findOne({ deviceId });
    if (!topic || !topic.topics.subscriber[0]) {
      throw new CustomError("Topic not found for device", 404);
    }
    const subscriberTopic = topic.topics.subscriber[0];

    const gateway = device.gatewayId;
    publishControlMessage(gateway, subscriberTopic, JSON.stringify(command));

    const updatedProperties = { ...actuator.properties };

    let hasChanges = false;
    for (const [key, value] of Object.entries(command)) {
      if (updatedProperties[key] !== value) {
        updatedProperties[key] = value;
        hasChanges = true;
      }
    }

      
    if (hasChanges) {
      await actuator.update({ properties: updatedProperties });
    }
      
  } catch (error) {
    throw error;
  }
};

module.exports = {
  controlDevice,
};
