require('dotenv').config();

const config = require('./src/config');
const connectDB = require('./src/config/db');
const http = require('http');

const app = require('./src/app');
const { connectToGateways } = require('./src/services/mqtt.services');
const { initSocket } = require('./src/services/websocket.services');

const server = http.createServer(app);

connectDB().then(() => {
    connectToGateways();
    initSocket(server);
})


server.listen(config.port, () => {
    console.log(`Server start with http://localhost:${config.port}`);
})

process.on('SIGINT', () => {
    server.close( () => console.log(`exits server express`))
})