import mongoose from "mongoose";

const triggerSchema = new mongoose.Schema({
    scenarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scenario",
        required: true,
    },
    type: {
        type: String,
        enum: ["time", "device"],
        required: true
    }
}, {
    timestamps: true
});

const Trigger = mongoose.model("Trigger", triggerSchema);

export default Trigger;