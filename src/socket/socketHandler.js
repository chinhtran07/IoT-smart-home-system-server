const myEmitter = require('../events/eventsEmitter');
const mongoDB = require('../models/mongo');

const initSocket = async (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('subscribe', (deviceId) => {
            console.log(`Client ${socket.id} subscribed to device ${deviceId}`);
            socket.join(deviceId);
            socket.join(`heartbeat${deviceId}`);
        });

        socket.on('unsubscribe', (deviceId) => {
            console.log(`Client ${socket.id} unsubscribed from device ${deviceId}`);
            socket.leave(deviceId);
            socket.leave(`heartbeat${deviceId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        socket.on('control', (message) => {
            try {
                const data = JSON.parse(message);
                const deviceId = data['deviceId'];
                console.log(data);
            } catch (error) {
                console.error(error.message);
            }
        })

        const handleDataReceived = async ({ device, data }) => {
            try {

                if (device.type === "sensor") {
                    const sensorData = new mongoDB.SensorData({ ...data, deviceId: device._id });
                    await sensorData.save();
                } else {

                }

                io.to(device.id.toString()).emit('data', data);
            } catch (err) {
                console.error('Error processing data:', err);
            }
        };

        const handleHeartbeat = async ({ device, data }) => {
            try {
                io.to(`heartbeat${device.id}`).emit('heartbeat', data);
            } catch (error) {
                console.error(error.message);
            }
        }

        // myEmitter.off('dataReceived', handleDataReceived);
        myEmitter.on('dataReceived', handleDataReceived);

        // myEmitter.off('heartbeat', handleHeartbeat);
        myEmitter.on('heartbeat', handleHeartbeat);
    });
};

module.exports = { initSocket };
