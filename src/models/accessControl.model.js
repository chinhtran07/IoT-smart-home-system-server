import mongoose from "mongoose";

const accessControlSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    permissions: [
      {
        device: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Device",
        },
        group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
        permissionLevel: { type: String, enum: ["read", "write", "all"], required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AccessControl = mongoose.model("AccessControl", accessControlSchema);

export default AccessControl;
