// eventsHandler.js
const myEmitter = require('../events/eventsEmitter');
const { onGatewayCreated, onDeviceCreated } = require('./mqttManager');
const { publishControlMessage } = require('./mqttControl');

myEmitter.on('control', ({ gatewayId, topic, payload }) => {
    console.log(gatewayId);
});
myEmitter.on('gatewayCreated', onGatewayCreated);
myEmitter.on('deviceCreated', onDeviceCreated);
