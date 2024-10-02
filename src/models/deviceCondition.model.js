import mongoose from "mongoose";
import Condition from "./condition.model.js";

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
},);


const DeviceCondition = Condition.discriminator("DeviceCondition", deviceConditionSchema);

export default DeviceCondition;