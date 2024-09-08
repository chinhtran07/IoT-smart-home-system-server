const mqtt = require('mqtt');
const myEmitter = require('../events/eventsEmitter');
const Gateway = require('../models/Gateway');
const Device = require('../models/Device');

const clients = {}

const connectToGateways = async () => {
    const gateways = await Gateway.find().exec();

    gateways.forEach(gateway => {
        if (!clients[gateway._id]) {
            const mqttHost = `mqtt://${gateway.ipAddress}:1883`;
            const client = mqtt.connect(mqttHost, {
                username: "Admin",
                password: "123456"
            });

            clients[gateway._id] = client;

            client.on('connect', () => {
                console.log(`Connected to MQTT brokerr at ${mqttHost}`);

                Device.find({ 'gatewayId': gateway._id }).then(devices => {
                    devices.forEach(device => {
                        device.topics.publisher.forEach(topic => {
                            client.subscribe(topic);
                        });
                    });
                });
            });

            client.on('message', (topic, message) => {
                console.log(`Received message on topic ${topic} : ${message.toString()}`);

                try {
                    Device.findOne({ 'topics.publisher': topic }).then(device => {
                        if (device) {
                            const data = JSON.parse(message.toString());
                            myEmitter.emit('dataReceived', { device, data });
                        } else {
                            console.error(`${topic} not found `);
                        }
                    })
                } catch (error) {
                    throw new Error(error.message);
                }
            });

            client.on('error', (err) => {
                console.log('MQTT Error', err);
            });
        }
    });
};




module.exports = {
    connectToGateways,
    clients
}