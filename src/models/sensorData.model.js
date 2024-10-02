import mongoose from "mongoose";

const sensorDataScheme = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    value: [{
      type: mongoose.Schema.Types.Mixed,
      required: true,
    }],
  },
  {
    timeseries: true,
  }
);

const SensorData = mongoose.model("SensorData", sensorDataScheme);

export default SensorData;
