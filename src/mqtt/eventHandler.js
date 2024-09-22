import myEmitter from '../events/eventsEmitter.js';
import { onGatewayCreated, onDeviceCreated } from './mqttManager.js';

myEmitter.on('gatewayCreated', onGatewayCreated);
myEmitter.on('deviceCreated', onDeviceCreated);
