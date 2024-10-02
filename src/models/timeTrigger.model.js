import mongoose from "mongoose";
import Trigger from "./trigger.model.js";

const timeTriggerSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    }
},);

const TimeTrigger = Trigger.discriminator("TimeTrigger", timeTriggerSchema);

export default TimeTrigger;