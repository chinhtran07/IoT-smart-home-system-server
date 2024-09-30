import mongoose from "mongoose";

const actionSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  property: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  scenarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scenario",
    },
  ],
  scenes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scene",
    },
  ],
});

const Action = mongoose.model("Action", actionSchema);

export default Action;
