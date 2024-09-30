import mongoose from "mongoose";

const sensorDataScheme = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    timeseries: true,
  }
);

const SensorData = mongoose.model("SensorData", sensorDataScheme);

export default SensorData;
