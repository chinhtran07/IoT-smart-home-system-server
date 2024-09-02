const myEmitter = require('../events/eventsEmitter');
const SensorData = require('../models/SensorData');

const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        // socket.dataSentFlag = false;

        socket.on('subscribe', (deviceId) => {
            console.log(`Client subscribed to device ${deviceId}`);
            socket.join(deviceId);
        });

        socket.on('unsubscribe', (deviceId) => {
            console.log(`Client ${socket.id} unsubscribed from device ${deviceId}`);
            socket.leave(deviceId);
            // socket.dataSentFlag = false;
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        myEmitter.on('dataReceived', async ({ device, data }) => {
            console.log(`Data received event from ${device._id}:`, data);

            try {
                if (device.type == "sensor") {
                    const sensorData = new SensorData({ ...data, deviceId: device._id });
                    await sensorData.save();
                } else {
                    // handle for actuator type 
                }

                    io.to(device._id.toString()).emit('data', data);
            } catch (err) {
                console.error('Error processing data:', err);
            }
        });

        // myEmitter.on('resetDataSentFlag', () => {
        //     socket.dataSentFlag = false;
        // });

    });
}

module.exports = { initSocket };