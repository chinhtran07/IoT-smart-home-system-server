import CustomError from "../utils/CustomError.js";
import { createFlow, updateFlow, deleteFlow } from "../node-red/index.js";
import Scenario from "../models/scenario.model.js";
import TriggerFactory from "../factories/triggerFactory.js";
import ConditionFactory from "../factories/conditionFactory.js";
import { getGatewayByUser } from "./gateway.service.js";
import Condition from "../models/condition.model.js";
import Trigger from "../models/trigger.model.js";
import Action from "../models/action.model.js"; // Ensure Action model is imported

export const createScenario = async (data, userId) => {
  const session = await Scenario.startSession();
  session.startTransaction();

  try {
    const scenario = new Scenario({
      name: data.name,
      userId,
      isEnabled: data.isEnabled || true,
    });

    await scenario.save({ session });

    const triggers = await Promise.all(
      data.triggers.map(trigger => 
        TriggerFactory.createTrigger(trigger.type, { ...trigger, scenarioId: scenario._id })
      )
    );

    const conditions = await Promise.all(
      data.conditions.map(condition => 
        ConditionFactory.createCondition(condition.type, { ...condition, scenarioId: scenario._id })
      )
    );

    scenario.triggers = triggers.map(t => t._id);
    scenario.conditions = conditions.map(c => c._id);
    scenario.actions = data.actions;

    await scenario.save({ session });

    const actionJson = data.actions; // Assuming actions are just IDs
    const gateway = await getGatewayByUser(userId);

    const scenarioJson = {
      id: scenario._id,
      name: scenario.name,
      isEnabled: scenario.isEnabled,
      actions: actionJson,
      triggers,
      conditions,
    };

    const res = await createFlow(gateway.ipAddress, scenarioJson);
    if (res.status === 200) {
      await session.commitTransaction();
    }

    return scenario;
  } catch (error) {
    await session.abortTransaction();
    throw new CustomError(error.message, 400);
  } finally {
    session.endSession();
  }
};

export const getScenarioById = async (scenarioId) => {
  try {
    const scenario = await Scenario.findById(scenarioId)
      .populate({ path: "actions", select: ["id", "deviceId", "property", "value"] })
      .populate({
        path: "triggers",
        select: ["id", "type"],
        populate: { path: "deviceId", model: "Device", select: ["id", "name"] },
      })
      .populate({
        path: "conditions",
        select: ["id", "type"],
        populate: { path: "deviceId", model: "Device", select: ["id", "name"] },
      });

    if (!scenario) {
      throw new CustomError("Scenario not found", 404);
    }

    return scenario;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

export const getScenariosByUser = async (userId) => {
  try {
    return await Scenario.find({ userId }).select("id name isEnabled");
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

export const updateScenario = async (scenarioId, data) => {
  const session = await Scenario.startSession();
  session.startTransaction();

  try {
    const scenario = await Scenario.findById(scenarioId).session(session);
    
    if (!scenario) {
      throw new CustomError("Scenario not found", 404);
    }

    // Update triggers
    const updatedTriggers = await Promise.all(
      data.triggers.map(trigger => updateOrCreateTrigger(trigger, scenario._id, session))
    );

    // Update conditions
    const updatedConditions = await Promise.all(
      data.conditions.map(condition => updateOrCreateCondition(condition, scenario._id, session))
    );

    Object.assign(scenario, {
      name: data.name,
      isEnabled: data.isEnabled,
      triggers: updatedTriggers.map(t => t._id),
      conditions: updatedConditions.map(c => c._id),
      actions: data.actions,
    });

    await scenario.save({ session });

    const actionJson = await Action.find({ _id: { $in: data.actions.map(action => action.id) } }).session(session);
    const gateway = await getGatewayByUser(scenario.userId);

    const scenarioJson = {
      id: scenario._id,
      name: scenario.name,
      isEnabled: scenario.isEnabled,
      actions: actionJson,
      triggers: updatedTriggers,
      conditions: updatedConditions,
    };

    const res = await updateFlow(gateway.ipAddress, scenarioJson, scenarioId);
    if (res.status === 204) {
      await session.commitTransaction();
    }

    return scenario;
  } catch (error) {
    await session.abortTransaction();
    throw new CustomError(error.message, 500);
  } finally {
    session.endSession();
  }
};

// Helper functions to update or create triggers and conditions
const updateOrCreateTrigger = async (trigger, scenarioId, session) => {
  const existingTrigger = await Trigger.findOne({ id: trigger.id, scenarioId }).session(session);
  if (existingTrigger) {
    Object.assign(existingTrigger, trigger);
    return existingTrigger.save({ session });
  }
  return TriggerFactory.createTrigger(trigger.type, { ...trigger, scenarioId });
};

const updateOrCreateCondition = async (condition, scenarioId, session) => {
  const existingCondition = await Condition.findOne({ id: condition.id, scenarioId }).session(session);
  if (existingCondition) {
    Object.assign(existingCondition, condition);
    return existingCondition.save({ session });
  }
  return ConditionFactory.createCondition(condition.type, { ...condition, scenarioId });
};

export const deleteScenario = async (scenarioId) => {
  const session = await Scenario.startSession();
  session.startTransaction();

  try {
    const scenario = await Scenario.findById(scenarioId).session(session);
    if (!scenario) {
      throw new CustomError("Scenario not found", 404);
    }

    await Promise.all([
      Trigger.deleteMany({ scenarioId }, { session }),
      Condition.deleteMany({ scenarioId }, { session }),
    ]);

    const gateway = await getGatewayByUser(scenario.userId);
    const res = await deleteFlow(gateway.ipAddress, scenarioId);

    if (res.status === 204) {
      await scenario.remove({ session });
      await session.commitTransaction();
    }

    return { message: "Scenario deleted successfully" };
  } catch (error) {
    await session.abortTransaction();
    throw new CustomError(error.message, 500);
  } finally {
    session.endSession();
  }
};