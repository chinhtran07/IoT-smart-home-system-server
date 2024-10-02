import mqtt from "mqtt";
import myEmitter from "../events/eventsEmitter.js";
import Device from "../models/device.model.js";

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
      const device = await Device.findOne({
        "topics.publisher": topic,
      });

      if (device) {
        const data = JSON.parse(message.toString());

        if (data.hasOwnProperty("alive") && data.alive === true) {
          console.log(`Device ${device._id} is Online`);

          if (!device.status) {
            device.status = true;
            await device.save();
          }

          myEmitter.emit("heartbeat", { device, data });
        } else {
          myEmitter.emit("dataReceived", { device, data });
        }
      } else {
        console.error(`Device for topic ${topic} not found`);
      }
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

export {
  clients,
  connectToGateway,
};
