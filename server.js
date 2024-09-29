import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import { app } from './src/app.js';
import config from './src/config/index.js';
import connectDB from './src/config/mongdb.config.js';
import mysqldb from './src/models/mysql/index.js';
import { connectToGateways } from './src/mqtt/index.js';
import { initSocket } from './src/socket/socketHandler.js';
import { startService } from './src/tasks/checkHeartbeat.js';
import ngrok from "@ngrok/ngrok";

dotenv.config();

const server = http.createServer(app);
const io = new SocketIO(server);

connectDB();

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

server.listen(config.port, () => {
  console.log(`Server started at http://localhost:${config.port}`);
});

ngrok.connect({ addr: config.port, authtoken: process.env.NGROK_AUTHTOKEN, domain: "strong-complete-sculpin.ngrok-free.app" })
.then(listener => console.log(`Ingress established at: ${listener.url()}`))

const stopService = startService();

process.on('SIGINT', () => {

  stopService();

  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  ngrok.disconnect();
});

