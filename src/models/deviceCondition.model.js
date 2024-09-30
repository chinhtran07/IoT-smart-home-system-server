import mongoose from "mongoose";
import Condition from "./condition.model";

const comparators = ["eq", "neq", "gt", "gte", "lt", "lte", "true", "false", "contains"];

const deviceConditionSchema = new mongoose.Schema({
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

deviceConditionSchema.add(Condition);

const DeviceCondition = mongoose.model("DeviceCondition", deviceConditionSchema);

export default DeviceCondition;