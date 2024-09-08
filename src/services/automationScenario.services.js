const { default: mongoose } = require("mongoose");
const Trigger = require("../models/Trigger");
const Condition = require("../models/Condition");
const Action = require("../models/Action");
const AutomationScenario = require("../models/AutomationScenario");

const createScenario = async (data, userId) => {
    const session = await mongoose.startSession(); // For transaction
    session.startTransaction();

    try {
        // Create Triggers
        const triggers = await Trigger.insertMany(data.triggers.map(trigger => ({
            ...trigger,
            user: data.user
        })), { session });

        // Create Conditions
        const conditions = await Condition.insertMany(data.conditions.map(condition => ({
            ...condition,
            user: data.user
        })), { session });

        // Create Actions
        const actions = await Action.insertMany(data.actions.map(action => ({
            ...action,
        })), { session });

        // Create Automation Scenario
        const scenario = new AutomationScenario({
            name: data.name,
            user: userId,
            triggers: triggers.map(trigger => trigger._id),
            conditions: conditions.map(condition => condition._id),
            actions: actions.map(action => action._id),
            enabled: data.enabled
        });

        await scenario.save({ session });

        await session.commitTransaction();
        session.endSession();

        return scenario;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message);
    }
};


const getScenarioById = async (scenarioId) => {
    try {
        const scenario = await AutomationScenario.findById(scenarioId)
            .populate('triggers')
            .populate('conditions')
            .populate('actions')

        if (!scenario) {
            throw new Error('Scenario not found');
        }
        return scenario;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getScenariosByUser = async (userId) => {
    try {
        const scenarios = await AutomationScenario.find({ user: userId }).select("_id name enabled");
        return scenarios;
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateScenario = async (scenarioId, data) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Update Triggers
        await Trigger.deleteMany({ _id: { $in: data.oldTriggers } }, { session });
        const newTriggers = await Trigger.insertMany(data.triggers.map(trigger => ({
            ...trigger,
        })), { session });

        // Update Conditions
        await Condition.deleteMany({ _id: { $in: data.oldConditions } }, { session });
        const newConditions = await Condition.insertMany(data.conditions.map(condition => ({
            ...condition,
        })), { session });

        // Update Actions
        await Action.deleteMany({ _id: { $in: data.oldActions } }, { session });
        const newActions = await Action.insertMany(data.actions.map(action => ({
            ...action,
        })), { session });

        // Update Automation Scenario
        const updatedScenario = await AutomationScenario.findByIdAndUpdate(
            scenarioId,
            {
                name: data.name,
                triggers: newTriggers.map(trigger => trigger._id),
                conditions: newConditions.map(condition => condition._id),
                actions: newActions.map(action => action._id),
                enabled: data.enabled
            },
            { new: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return updatedScenario;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message);
    }
};

const deleteScenario = async (scenarioId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const scenario = await AutomationScenario.findById(scenarioId);

        if (!scenario) {
            throw new Error('Scenario not found');
        }

        // Delete associated Triggers, Conditions, Actions
        await Trigger.deleteMany({ _id: { $in: scenario.triggers } }, { session });
        await Condition.deleteMany({ _id: { $in: scenario.conditions } }, { session });
        await Action.deleteMany({ _id: { $in: scenario.actions } }, { session });

        // Delete Automation Scenario
        await AutomationScenario.findByIdAndDelete(scenarioId, { session });

        await session.commitTransaction();
        session.endSession();

        return { message: 'Scenario deleted successfully' };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message);
    }
};

module.exports = {
    createScenario,
    getScenarioById,
    getScenariosByUser,
    updateScenario,
    deleteScenario
}