import mongoose from "mongoose";
import * as mqttService from "../mqtt/mqttManager.js";

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["actuator", "sensor"],
      required: true,
    },
    macAddress: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gatewayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gateway",
      required: true,
    },
    firmwareVersion: {
      type: String,
      required: true,
    },
    topics: {
      publisher: [{ type: String }],
      subscriber: [{ type: String }],
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
      },
    ],
  },
  {
    timestamps: true,
  }
);

deviceSchema.post("save", async (device) => {
  await mqttService.onDeviceCreated(device);
});

const Device = mongoose.model("Device", deviceSchema);

export default Device;
