import jwt from "jsonwebtoken";
import myEmitter from "../events/eventsEmitter.js";
import SensorData from "../models/sensorData.model.js";
import Actuator from "../models/actuator.model.js";

export const initSocket = async (io) => {
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

    // Đăng ký các sự kiện trong kết nối socket
    const handleDataReceived = async ({ device, data }) => {
      try {
        console.log("Data received in handleDataReceived:", data); // Thêm log để kiểm tra dữ liệu
        if (device.type === "sensor") {
          // Save sensor data
          await SensorData.create({
            ...data,
            deviceId: device._id,
          });
        } else if (device.type === "actuator") {

          // Update properties only if changed
          const updatedProperties = Object.entries(data).reduce((acc, [key, value]) => {
            if (device.properties[key] !== value) {
              acc[key] = value;
            }
            return acc;
          }, {});

          if (Object.keys(updatedProperties).length) {
            device.properties = { ...device.properties, ...updatedProperties };
            await device.save();
          }
        }

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

    // Đăng ký sự kiện để xử lý dữ liệu và nhịp tim
    myEmitter.on("dataReceived", handleDataReceived);
    myEmitter.on("heartbeat", handleHeartbeat);

    socket.on("disconnect", () => {
      // Cleanup event listeners on disconnect to prevent memory leaks
      myEmitter.off("dataReceived", handleDataReceived);
      myEmitter.off("heartbeat", handleHeartbeat);
    });
  });
};
