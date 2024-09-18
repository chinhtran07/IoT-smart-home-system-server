// index.js
const { connectToGateways } = require('./mqttManager');
const clients = require('./mqttClient').clients;

module.exports = {
    connectToGateways,
    clients,
};
