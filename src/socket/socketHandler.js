import myEmitter from "../events/eventsEmitter.js";
import mongoDB from "../models/mongo/index.js";
import mysqlDb from "../models/mysql/index.js";

export const initSocket = async (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("subscribe", (deviceId) => {
      console.log(`Client ${socket.id} subscribed to device ${deviceId}`);
      socket.join(deviceId);
      socket.join(`heartbeat${deviceId}`);
    });

    socket.on("unsubscribe", (deviceId) => {
      console.log(`Client ${socket.id} unsubscribed from device ${deviceId}`);
      socket.leave(deviceId);
      socket.leave(`heartbeat${deviceId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    const handleDataReceived = async ({ device, data }) => {
      try {
        if (device.type === "sensor") {
          const sensorData = new mongoDB.SensorData({
            ...data,
            deviceId: device._id,
          });
          await sensorData.save();
        } else if (device.type === "actuator") {
            console.log(data);
          const actuator = await mysqlDb.Actuator.findByPk(device.id);
          const updatedProperties = { ...actuator.properties };

          let hasChanges = false;
          for (const [key, value] of Object.entries(data)) {
            if (updatedProperties[key] !== value) {
              updatedProperties[key] = value;
              hasChanges = true;
            }
          }

          if (hasChanges) {
            await actuator.update({ properties: updatedProperties });
          }
        }

        io.to(device.id.toString()).emit("data", data);
      } catch (err) {
        console.error("Error processing data:", err);
      }
    };

    const handleHeartbeat = async ({ device, data }) => {
      try {
        io.to(`heartbeat${device.id}`).emit("heartbeat", data);
      } catch (error) {
        console.error(error.message);
      }
    };

    // myEmitter.off('dataReceived', handleDataReceived);
    myEmitter.on("dataReceived", handleDataReceived);

    // myEmitter.off('heartbeat', handleHeartbeat);
    myEmitter.on("heartbeat", handleHeartbeat);
  });
};
