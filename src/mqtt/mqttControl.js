// mqttControl.js
const { clients } = require('./mqttClient');

const publishControlMessage = ({ gatewayId, topic, payload }) => {
    const client = clients[gatewayId];
    if (client) {
        try {
            console.log(client);
            client.publish(topic, JSON.stringify(payload), (err) => {
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
