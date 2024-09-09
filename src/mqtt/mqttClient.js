const mqtt = require('mqtt');
const myEmitter = require('../events/eventsEmitter');
const Gateway = require('../models/Gateway');
const Device = require('../models/Device');

const clients = {};

// Kết nối tới tất cả các gateway
const connectToGateways = async () => {
    try {
        const gateways = await Gateway.find().exec();
        gateways.forEach(gateway => {
            if (!clients[gateway._id]) {
                const mqttHost = `mqtt://${gateway.ipAddress}:1883`;
                const client = mqtt.connect(mqttHost, {
                    username: "Admin",
                    password: "123456",
                });

                clients[gateway._id] = client;

                client.on('connect', () => {
                    console.log(`Connected to MQTT broker at ${mqttHost}`);

                    // Tìm tất cả thiết bị theo gateway và đăng ký chủ đề
                    Device.find({ gatewayId: gateway._id }).then(devices => {
                        devices.forEach(device => {
                            device.topics.publisher.forEach(topic => {
                                client.subscribe(topic, (err) => {
                                    if (err) {
                                        console.error(`Failed to subscribe to topic: ${topic}`);
                                    }
                                });
                            });
                        });
                    }).catch(err => console.error('Error fetching devices', err));
                });

                // Xử lý tin nhắn nhận từ MQTT
                client.on('message', async (topic, message) => {
                    console.log(`Received message on topic ${topic}: ${message.toString()}`);

                    try {
                        const device = await Device.findOne({ 'topics.publisher': topic });
                        if (device) {
                            const data = JSON.parse(message.toString());
                            myEmitter.emit('dataReceived', { device, data });
                        } else {
                            console.error(`Device for topic ${topic} not found`);
                        }
                    } catch (error) {
                        console.error('Error processing MQTT message:', error.message);
                    }
                });

                // Xử lý sự kiện lỗi MQTT
                client.on('error', (err) => {
                    console.error('MQTT Error:', err);
                });

                // Xử lý sự kiện mất kết nối MQTT
                client.on('close', () => {
                    console.warn(`MQTT client disconnected from ${mqttHost}`);
                    // Hủy đăng ký tất cả các chủ đề của client này nếu mất kết nối
                    client.end(true);
                });
            }
        });
    } catch (err) {
        console.error('Error connecting to gateways:', err);
    }
};

myEmitter.on('control', (gatewayId, topic, payload) => {
    const client = clients[gatewayId];
    if (client) {
        try {
            client.publish(topic, payload, (err) => {
                if (err) {
                    console.error(`Failed to publish to topic ${topic}`, err);
                } else {
                    console.log(`Published message to topic ${topic}`);
                }
            });
        } catch (error) {
            console.error(`Error publishing message to topic ${topic}:`, error.message);
        }
    } else {
        console.error(`MQTT client for gateway ${gatewayId} not found`);
    }
});

module.exports = {
    connectToGateways,
    clients,
};
