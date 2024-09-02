const mongoose = require("mongoose");

const accessControlSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permissions: [
      {
        device: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
        group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
        permissionLevel: { type: String, enum: ["read", "write", "all"] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AccessControl = mongoose.model("AccessControl", accessControlSchema);

module.exports = AccessControl;
