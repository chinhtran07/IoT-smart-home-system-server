export default (mongoose) => {
  const accessControlSchema = new mongoose.Schema(
    {
      owner: {
        type: String,
        required: true,
        unique: true,
      },
      userId: {
        type: String,
        required: true,
        unique: true,
      },
      permissions: [
        {
          device: { type: String },
          group: { type: String },
          permissionLevel: { type: String, enum: ["read", "write", "all"] },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

  const AccessControl = mongoose.model("AccessControl", accessControlSchema);

  return AccessControl;
};
