import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema({
    scenarioId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Scenario"
    },
    type: {
        type: String,
        enum: ["time", "device"],
        required: true
    }
}, {
    timestamps: true,
});

const Condition = mongoose.model("Conditionn", conditionSchema);

export default Condition;