import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import app from './src/app.js';
import config from './src/config/index.js';
import connectDB from './src/config/mongdb.config.js';
import mysqldb from './src/models/mysql/index.js';
import { connectToGateways } from './src/mqtt/index.js';
import { initSocket } from './src/socket/socketHandler.js';
import {startService} from './src/tasks/checkHeartbeat.js';

dotenv.config();

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new SocketIO(server);

// Connect MongoDB
connectDB();

// Authenticate and sync MySQL database
mysqldb.sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL connection has been established successfully.');
    // Initialize MQTT and Socket after DB connection
    connectToGateways();
    initSocket(io);
  })
  .catch((error) => {
    console.error('Unable to connect to MySQL database:', error);
  });

mysqldb.sequelize.sync({ force: false }).then(() => {
  console.log('MySQL Database synchronized');
});

// Start services like checking heartbeat
startService();

// Start the server
server.listen(config.port, () => {
  console.log(`Server started at http://localhost:${config.port}`);
});

// Gracefully handle shutdown
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
  });
});
