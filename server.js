require('dotenv').config();

const config = require('./src/config');
const connectDB = require('./src/config/db');
const http = require('http');
const app = require('./src/app');
const socketIo = require('socket.io');
const { connectToGateways } = require('./src/mqtt/mqttClient');
const { initSocket } = require('./src/socket/socketHandler');

const server = http.createServer(app);
const io = socketIo(server);

connectDB().then(() => {
    connectToGateways();
    initSocket(io);
})


server.listen(config.port, () => {
    console.log(`Server start with http://localhost:${config.port}`);
})

process.on('SIGINT', () => {
    server.close( () => console.log(`exits server express`))
})