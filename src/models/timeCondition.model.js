import mongoose from "mongoose";
import Condition from "./condition.model.js";

const timeConditionSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    }
}, );


const TimeCondition = Condition.discriminator("TimeCondition", timeConditionSchema);

export default TimeCondition;