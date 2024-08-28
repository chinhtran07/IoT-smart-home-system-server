const EventEmitter = require('events');
const Gateway = require('../models/Gateway');
const mqtt = require('mqtt');
const Device = require('../models/Device');
const CustomError = require('../utils/CustomError');



const eventEmitter = new EventEmitter();
const mqttClients = {}

const connectToGateways = async () => {
    try {
        const gateways = await Gateway.find().exec();

        gateways.forEach(gateway => {
            if (!mqttClients[gateway._id]) {
                const mqttHost = `mqtt://${gateway.ipAddress}:1883`;
                const mqttClient = mqtt.connect(mqttHost);

                mqttClients[gateway._id] = mqttClient;

                mqttClient.on('connect', () => {
                    console.log(`Connected to MQTT broker at ${mqttHost}`);

                    Device.find({ 'gatewayId': gateway._id }).then(devices => {
                        devices.forEach(device => {
                            device.topics.forEach(topic => {
                                mqttClient.subscribe(topic);
                            })
                        })
                    })
                });

                mqttClient.on('message', (topic, message) => {
                    console.log(`Received message on topic ${topic}: ${message.toString()}`);
                    
                    try {

                        Device.findOne({ 'topics': topic }).then(device => {
                            if (device) {
                                const data = JSON.parse(message.toString());
                                eventEmitter.emit('dataReceived', { device, data });
                            } else {
                                throw new CustomError('Not Found', 404);
                            }
                        })

                    } catch (error) {
                        throw new Error(error.message);
                    }
                });

                mqttClient.on('error', (error) => {
                    console.log('MQTT Error', error);
                });
            }
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    eventEmitter,
    connectToGateways
}