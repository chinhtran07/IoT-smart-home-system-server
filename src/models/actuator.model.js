import mongoose from "mongoose";
import Device from "./device.model.js";

// Define the Actuator schema
const actuatorSchema = new mongoose.Schema({
  detailedType: {
    type: String,
    required: true,
  },
  properties: {
    type: Object,
    required: true,
  },
  actions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Action",
  }],
});

const Actuator = Device.discriminator("Actuator", actuatorSchema);

export default Actuator;
