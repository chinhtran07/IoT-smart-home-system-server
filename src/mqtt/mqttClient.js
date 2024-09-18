const mqtt = require("mqtt");
const myEmitter = require("../events/eventsEmitter");
const mysqlDb = require("../models/mysql");
const mongoDb = require("../models/mongo");
const redisClient = require("../config/redis.config");

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

    const devices = await mysqlDb.Device.findAll({
      where: { gatewayId: gateway.id },
    });
    for (const device of devices) {
      const topicDoc = await mongoDb.Topic.findOne({
        deviceId: device.id,
      }).exec();
      if (topicDoc) {
        topicDoc.topics.publisher.forEach((topic) => {
          client.subscribe(topic, (err) => {
            if (err) {
              console.error(`Failed to subscribe to topic: ${topic}`);
            }
          });
        });
      } else {
        console.error(`No topics found for device ${device.id}`);
      }
    }
  });

  client.on("message", async (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);

    try {
      const topicDoc = await mongoDb.Topic.findOne({
        "topics.publisher": topic,
      }).exec();
      if (topicDoc) {
        const deviceId = topicDoc.deviceId;

        // Check Redis cache for device status
        const cachedStatus = await redisClient.get(`deviceStatus:${deviceId}`);
        let device;
        if (cachedStatus) {
          device = JSON.parse(cachedStatus);
        } else {
          device = await mysqlDb.Device.findByPk(deviceId, {
            attributes: ["id", "status", "type"],
          });
          if (device) {
            // Cache device status in Redis
            await redisClient.set(`deviceStatus:${deviceId}`, JSON.stringify(device), { EX: 3600 });
          }
        }

        if (device) {
          const data = JSON.parse(message.toString());

          if (data.hasOwnProperty("alive") && data.alive === true) {
            console.log(`Device ${device.id} is Online`);

            if (device.status !== "online") {
              await mysqlDb.Device.update(
                { status: "online" },
                { where: { id: device.id } }
              );
              // Update cache after status change
              await redisClient.set(`deviceStatus:${deviceId}`, JSON.stringify({ ...device, status: "online" }), { EX: 3600 });
            }

            myEmitter.emit("heartbeat", { device, data });

            await redisClient.set(`heartbeat:${device.id}`, new Date().toISOString());
          } else {
            myEmitter.emit("dataReceived", { device, data });
          }
        } else {
          console.error(`Device for topic ${topic} not found`);
        }
      } else {
        console.error(`Topic document for topic ${topic} not found`);
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

module.exports = {
  clients,
  connectToGateway,
};
