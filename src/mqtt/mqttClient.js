import mqtt from "mqtt";
import myEmitter from "../events/eventsEmitter.js";
import Device from "../models/device.model.js";
import redisClient from "../config/redis.config.js";

const clients = {};

const connectToGateway = async (gateway) => {
  if (clients[gateway.id]) return; // Already connected

  const mqttHost = `mqtt://${gateway.ipAddress}:1883`;
  const client = mqtt.connect(mqttHost, {
    username: "Admin",
    password: "123456",
  });

  clients[gateway.id] = client;

  client.on("connect", async () => {
    console.log(`Connected to MQTT broker at ${mqttHost}`);

    const devices = await Device.find({ gatewayId: gateway._id });

    for (const device of devices) {
      if (device.topics && device.topics.publisher) {
        device.topics.publisher.forEach((topic) => {
          client.subscribe(topic, (err) => {
            if (err) {
              console.error(`Failed to subscribe to topic: ${topic}`);
            }
          });
        });
      }
    }
  });

  client.on("message", async (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);

    try {
      const device = await Device.findOne({ "topics.publisher": topic });

      if (!device) return;
      
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch (err) {
        console.error(`Invalid JSON received on topic ${topic}:`, err);
        return; // Exit if JSON is invalid
      }

      // If the message is not related to the heartbeat, handle the dataReceived event
      if (!data.hasOwnProperty("alive")) {
        myEmitter.emit("dataReceived", { device, data });
        return;
      }

      if (!data.alive) return;

      // Update device status to online if necessary
      if (!device.status) {
        device.status = true;
        await Device.updateOne({ _id: device._id }, { status: true });
      }

      await redisClient.set(
        `heartbeat:${device._id}`,
        new Date().toISOString(),
        "EX",
        120
      ); // Expire after 2 minutes

      // Emit the heartbeat event for further processing
      myEmitter.emit("heartbeat", { device, data });
    } catch (error) {
      console.error("Error processing MQTT message:", error.message);
    }
  });

  client.on("error", (err) => {
    console.error("MQTT Error:", err);
  });

  client.on("close", () => {
    console.warn(`MQTT client disconnected from ${mqttHost}`);
    client.end(true);
  });
};

export { clients, connectToGateway };
