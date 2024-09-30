import mongoose from "mongoose";
import Condition from "./condition.model";

const timeConditionSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    }
}, { _id: false });

timeConditionSchema.add(Condition);

const TimeCondition = mongoose.model("TimeCondition", timeConditionSchema);

export default TimeCondition;