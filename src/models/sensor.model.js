import mongoose from "mongoose";
import Device from "./device.model.js";

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
);


const Sensor = Device.discriminator("Sensor", sensorSchema);

export default Sensor;
