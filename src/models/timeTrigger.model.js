import mongoose from "mongoose";
import Trigger from "./trigger.model";

const timeTriggerSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    }
}, { _id: false });

timeTriggerSchema.add(Trigger);

const TimeTrigger = mongoose.model("TimeTrigger", timeTriggerSchema);

export default TimeTrigger;