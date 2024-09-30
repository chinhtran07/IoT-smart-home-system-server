import mongoose from "mongoose";
import Device from "./device.model";

const actuatorSchema = new mongoose.Schema(
  {
    detailedType: {
      type: String,
      required: true,
    },
    properties: {
      type: Object,
      required: true,
    },
  },
  { _id: false }
);

actuatorSchema.add(Device);

const Actuator = Device.discriminator("Actuator", actuatorSchema);

export default Actuator;
