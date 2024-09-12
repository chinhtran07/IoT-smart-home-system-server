const myEmitter = require('../events/eventsEmitter');
const mongoDB = require('../models/mongo');

const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('subscribe', (deviceId) => {
            console.log(`Client ${socket.id} subscribed to device ${deviceId}`);
            socket.join(deviceId);
        });

        socket.on('unsubscribe', (deviceId) => {
            console.log(`Client ${socket.id} unsubscribed from device ${deviceId}`);
            socket.leave(deviceId);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        // Avoid multiple listeners by removing previous listener if necessary
        const handleDataReceived = async ({ device, data }) => {
            console.log(`Data received event from ${device._id}:`, data);

            try {
                if (device.type === "sensor") {
                    const sensorData = new mongoDB.SensorData({ ...data, deviceId: device.id });
                    await sensorData.save();
                } else {
                    // Handle actuator type if needed
                }

                io.to(device._id.toString()).emit('data', data);
            } catch (err) {
                console.error('Error processing data:', err);
            }
        };

        myEmitter.off('dataReceived', handleDataReceived); // Ensure no duplicate listeners
        myEmitter.on('dataReceived', handleDataReceived);
    });
};

module.exports = { initSocket };
