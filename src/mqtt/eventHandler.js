const myEmitter = require('../events/eventsEmitter');
const { onGatewayCreated, onDeviceCreated } = require('./mqttManager');

myEmitter.on('gatewayCreated', onGatewayCreated);
myEmitter.on('deviceCreated', onDeviceCreated);
