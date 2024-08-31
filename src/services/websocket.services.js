const socketIo = require('socket.io');
const { eventEmitter } = require('./mqtt.services');
const SensorData = require('../models/SensorData');

let io;

const initSocket = (server) => {
    io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A client connected:', socket.id);

        socket.on('subscribe', (deviceId) => {
            console.log(`Client subscribed to device ${deviceId}`);
            socket.join(deviceId);
        });

        socket.on('unsubscribe', (deviceId) => {
            console.log(`Client ${socket.id} unsubscribed from device ${deviceId}`);
            socket.leave(deviceId);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
    
    eventEmitter.on('dataReceived', async ({ device, data }) => {
        console.log('Data received event:', data);

        try {
            const sensorData = new SensorData({ ...data, deviceId: device._id });
            await sensorData.save();

            io.to(device._id.toString()).emit('sensorData', data);
        } catch (error) {
            console.error('Error processing data:', error);
        }
    });
}

const broadcastToRoom = (room, event, data) => {
    io.to(room).emit(event, data);
};


const sendToClient = (socketId, event, data) => {
    io.to(socketId).emit(event, data);
};


module.exports = {
    initSocket,
    broadcastToRoom,
    sendToClient
};