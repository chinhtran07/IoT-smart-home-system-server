require("dotenv").config();

const config = require("./src/config");
const http = require("http");
const app = require("./src/app");
const socketIo = require("socket.io");
const { initSocket } = require("./src/socket/socketHandler");
const connectDB = require("./src/config/mongdb.config");
const mysqldb = require("./src/models/mysql");
const { connectToGateways } = require("./src/mqtt");
const startService = require("./src/tasks.js/checkHeartbeat");

const server = http.createServer(app);
const io = socketIo(server);

connectDB();
mysqldb.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    connectToGateways();
    initSocket(io);
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

mysqldb.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
});

// startService();

server.listen(config.port, () => {
  console.log(`Server start with http://localhost:${config.port}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`exits server express`));
});
