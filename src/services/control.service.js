import CustomError from "../utils/CustomError.js";
import { publishControlMessage } from "../mqtt/mqttControl.js";
import Device from "../models/device.model.js";
import Actuator from "../models/actuator.model.js";
import myEmitter from "../events/eventsEmitter.js";

export const controlDevice = async (deviceId, command) => {
  try {
    // Fetch device and actuator, and ensure the properties are selected
    const [device, actuator] = await Promise.all([
      Device.findById(deviceId).select("gatewayId topics"),
      Actuator.findById(deviceId)
    ]);

    // Ensure device and actuator exist
    if (!device || !actuator) {
      throw new CustomError("Actuator or Device not found", 404);
    }

    // Validate command keys and ensure subscriber topic is valid
    const topics = device.topics;
    const isValidCommand = Object.keys(command).every(key => key in actuator.properties);

    if (!isValidCommand) {
      const invalidKeys = Object.keys(command).filter(key => !(key in actuator.properties));
      throw new CustomError(`Invalid command keys: ${invalidKeys.join(", ")}`, 400); // Bad request
    }

    if (!topics?.subscriber || !Array.isArray(topics.subscriber) || topics.subscriber.length === 0) {
      throw new CustomError("Subscriber topic not found for device", 404);
    }

    // Publish control message
    const subscriberTopic = topics.subscriber[0];
    publishControlMessage(device.gatewayId, subscriberTopic, JSON.stringify(command));

    // Update actuator properties if there are changes
    const updatedProperties = { ...actuator.properties };
    let hasChanges = false;

    for (const [key, value] of Object.entries(command)) {
      if (updatedProperties[key] !== value) {
        updatedProperties[key] = value;
        hasChanges = true;
      }
    }

    // Save updated actuator if changes were made
    if (hasChanges) {
      actuator.properties = updatedProperties; 
      await actuator.save();
    }

    console.log(command);

    myEmitter.emit("deviceControl", { deviceId, command });
  } catch (error) {
    throw error; // Consider logging the error before throwing it
  }
};

export default {
  controlDevice,
};
