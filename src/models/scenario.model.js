import mongoose from "mongoose";

const scenarioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    triggers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trigger",
      },
    ],
    conditions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Condition",
      },
    ],
    actions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Action",
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Scenario = mongoose.model("Scenario", scenarioSchema);

export default Scenario;
