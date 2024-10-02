import mongoose from "mongoose";
import * as mqttService from "../mqtt/mqttManager.js";

const gatewaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
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
    devices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
  },
  {
    timestamps: true,
  }
);

gatewaySchema.post("save", async (gateway) => {
  await mqttService.onGatewayCreated(gateway);
});

const Gateway = mongoose.model("Gateway", gatewaySchema);

export default Gateway;
