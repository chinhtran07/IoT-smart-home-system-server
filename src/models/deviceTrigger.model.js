import mongoose from "mongoose";
import Trigger from "./trigger.model";

const comparators = ["eq", "neq", "gt", "gte", "lt", "lte", "true", "false", "contains"];

const deviceTriggerSchema = new mongoose.Schema({
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
        required: true
    },
    comparator: {
        type: String,
        enum: comparators,
        required: true
    },
    value: {
        type: String,
        required: true
    }
}, { _id: false });

deviceTriggerSchema.add(Trigger);

const DeviceTrigger = Trigger.discriminator("DeviceTrigger", deviceTriggerSchema);

export default DeviceTrigger;