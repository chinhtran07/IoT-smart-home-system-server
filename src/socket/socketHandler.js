import jwt from "jsonwebtoken";
import myEmitter from "../events/eventsEmitter.js";
import SensorData from "../models/sensorData.model.js";
import Actuator from "../models/actuator.model.js";

export const initSocket = async (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = user;
      console.log(socket.id);
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

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
      console.log(`Client disconnected: ${socket.id}`);
    });

    const handleDataReceived = async ({ device, data }) => {
      try {
        if (device.type === "sensor") {
          // Save sensor data
          await SensorData.create({
            ...data,
            deviceId: device._id,
          });
        } else if (device.type === "actuator") {
          const actuator = await Actuator.findById(device._id);
          if (!actuator) return;

          // Update properties only if changed
          const updatedProperties = Object.entries(data).reduce((acc, [key, value]) => {
            if (actuator.properties[key] !== value) {
              acc[key] = value;
            }
            return acc;
          }, {});

          if (Object.keys(updatedProperties).length) {
            actuator.properties = { ...actuator.properties, ...updatedProperties };
            await actuator.save();
          }
        }

        // Emit data to the subscribed clients
        io.to(device._id.toString()).emit("data", data);
      } catch (err) {
        console.error("Error processing data:", err);
      }
    };

    const handleHeartbeat = async ({ device, data }) => {
      try {
        // Emit heartbeat event to subscribed clients
        io.to(`heartbeat${device._id}`).emit("heartbeat", data);
      } catch (error) {
        console.error("Error emitting heartbeat:", error.message);
      }
    };

    const handleDeviceControl = async (id, data) => {
      try {
        io.to(id).emit("data", data);
      } catch (err) {
        console.error("Error at handle control");
      }
    }

    // Attach event listeners once per socket connection
    myEmitter.on("deviceControl", handleDeviceControl);
    myEmitter.on("dataReceived", handleDataReceived);
    myEmitter.on("heartbeat", handleHeartbeat);

    socket.on("disconnect", () => {
      // Cleanup event listeners on disconnect to prevent memory leaks
      myEmitter.off("dataReceived", handleDataReceived);
      myEmitter.off("heartbeat", handleHeartbeat);
    });
  });
};
