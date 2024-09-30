import mongoose from "mongoose";
import Device from "./device.model";

const sensorSchema = new mongoose.Schema({
  detailedType: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
},
    { _id: false }
);

sensorSchema.add(Device);

const Sensor = Device.discriminator("Sensor", sensorSchema);

export default Sensor;
