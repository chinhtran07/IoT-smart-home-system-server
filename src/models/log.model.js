import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const Log = mongoose.model("Log", logSchema);

export default Log;
