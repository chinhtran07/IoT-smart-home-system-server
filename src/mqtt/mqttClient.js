// mqttClient.js
const mqtt = require('mqtt');
const myEmitter = require('../events/eventsEmitter');
const mysqlDb = require('../models/mysql');
const mongoDb = require('../models/mongo');

const clients = {};

const connectToGateway = async (gateway) => {
    if (clients[gateway.id]) return; // Already connected

    const mqttHost = `mqtt://${gateway.ipAddress}:1883`;
    const client = mqtt.connect(mqttHost, {
        username: "Admin",
        password: "123456",
    });

    clients[gateway.id] = client;

    client.on('connect', async () => {
        console.log(`Connected to MQTT broker at ${mqttHost}`);

        const devices = await mysqlDb.Device.findAll({ where: { gatewayId: gateway.id } });
        for (const device of devices) {
            const topicDoc = await mongoDb.Topic.findOne({ deviceId: device.id }).exec();
            if (topicDoc) {
                topicDoc.topics.publisher.forEach(topic => {
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

    client.on('message', async (topic, message) => {
        console.log(`Received message on topic ${topic}: ${message.toString()}`);

        try {
            const topicDoc = await mongoDb.Topic.findOne({ 'topics.publisher': topic }).exec();
            if (topicDoc) {
                const device = await mysqlDb.Device.findByPk(topicDoc.deviceId);
                if (device) {
                    const data = JSON.parse(message.toString());
                    myEmitter.emit('dataReceived', { device, data });
                } else {
                    console.error(`Device for topic ${topic} not found`);
                }
            } else {
                console.error(`Topic document for topic ${topic} not found`);
            }
        } catch (error) {
            console.error('Error processing MQTT message:', error.message);
        }
    });

    client.on('error', (err) => {
        console.error('MQTT Error:', err);
    });

    client.on('close', () => {
        console.warn(`MQTT client disconnected from ${mqttHost}`);
        client.end(true);
    });
};

module.exports = {
    clients,
    connectToGateway,
};
