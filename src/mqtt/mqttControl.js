// mqttControl.js
const { clients } = require('./mqttClient');

const publishControlMessage = ( gatewayId, topic, payload ) => {
    const client = clients[gatewayId];

    console.log(payload);
    if (client) {
        try {
            client.publish(topic, payload, true ,(err) => {
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
};

module.exports = {
    publishControlMessage,
};
