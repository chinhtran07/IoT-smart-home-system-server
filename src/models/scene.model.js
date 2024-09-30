import mongoose from "mongoose";

const sceneSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    actions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Action",
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Scene = mongoose.model("Scene", sceneSchema);

export default Scene;
