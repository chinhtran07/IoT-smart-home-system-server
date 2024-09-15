const { v4: uuidv4 } = require("uuid");
const mysqlDb = require("../models/mysql");
const CustomError = require("../utils/CustomError");
const generateFlow = require("../node-red/generateFlow");
const { createFlow } = require("../node-red/api");

const createScenario = async (data, userId) => {
  const transaction = await mysqlDb.sequelize.transaction();

  try {
    const scenario = await mysqlDb.Scenario.create(
      {
        name: data.name,
        userId,
        isEnabled: data.isEnabled || true,
      },
      { transaction }
    );

    await Promise.all([
      processTriggers(data.triggers, scenario.id, transaction),
      processConditions(data.conditions, scenario.id, transaction),
    ]);

    await processActions(data.actions, scenario.id, transaction);
    const gateway = await mysqlDb.Gateway.findOne({
      where: { userId },
      attributes: ["ipAddress"],
    });

    if (!gateway) {
      throw new CustomError("Gateway not found for user", 404);
    }

    // Ensure triggers, conditions, and actions exist
    const scenarioJson = {
      id: scenario.id,
      name: scenario.name,
      isEnabled: scenario.isEnabled,
      actions: transformActions(data.actions),
      triggers: transformTriggers(data.triggers),
      conditions: transformConditions(data.conditions)
    };

    const flowJson = await generateFlow(scenarioJson, gateway);

    const res = await createFlow(gateway.ipAddress, flowJson);

    if (res.status === 200) 
        await transaction.commit();

    return scenario;
  } catch (error) {
    await transaction.rollback();
    throw new CustomError(error.message, 400);
  }
};

const getScenarioById = async (scenarioId) => {
  try {
    // Lấy thông tin cơ bản của scenario và các liên kết chính
    const scenario = await mysqlDb.Scenario.findByPk(scenarioId, {
      include: [
        {
          model: mysqlDb.Action,
          attributes: ["id", "deviceId", "property", "value"],
        },
      ],
      attributes: ["id", "name", "isEnabled"],
    });

    if (!scenario) {
      throw new CustomError("Scenario not found", 404);
    }

    // Truy vấn Trigger và Conditions cùng một lúc
    const [triggers, conditions] = await Promise.all([
      mysqlDb.Trigger.findAll({
        where: { scenarioId },
        attributes: ["id", "type"],
      }),
      mysqlDb.Condition.findAll({
        where: { scenarioId },
        attributes: ["id", "type"],
      }),
    ]);

    const triggerIds = triggers.map((trigger) => trigger.id);
    const conditionIds = conditions.map((condition) => condition.id);

    const [deviceTriggers, timeTriggers, deviceConditions, timeConditions] =
      await Promise.all([
        mysqlDb.DeviceTrigger.findAll({
          where: { id: triggerIds },
          attributes: { exclude: ["updatedAt"] },
        }),
        mysqlDb.TimeTrigger.findAll({
          where: { id: triggerIds },
          attributes: { exclude: ["updatedAt"] },
        }),
        mysqlDb.DeviceCondition.findAll({ where: { id: conditionIds } }),
        mysqlDb.TimeCondition.findAll({ where: { id: conditionIds } }),
      ]);

    const formattedTriggers = triggers.map((trigger) => {
      const triggerData = trigger.toJSON();
      return {
        ...triggerData,
        detail:
          (triggerData.type === "device"
            ? deviceTriggers.find((dt) => dt.id === trigger.id)
            : timeTriggers.find((tt) => tt.id === trigger.id)) || null,
      };
    });

    const formattedConditions = conditions.map((condition) => {
      const conditionData = condition.toJSON();
      return {
        ...conditionData,
        detail:
          (conditionData.type === "device"
            ? deviceConditions.find((dc) => dc.id === condition.id)
            : timeConditions.find((tc) => tc.id === condition.id)) || null,
      };
    });

    return {
      id: scenario.id,
      name: scenario.name,
      isEnabled: scenario.isEnabled,
      actions: scenario.Actions.map((action) => action.toJSON()),
      triggers: formattedTriggers,
      conditions: formattedConditions,
    };
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

const getScenariosByUser = async (userId) => {
  try {
    return await mysqlDb.Scenario.findAll({
      where: { userId },
      attributes: ["id", "name", "isEnabled"],
    });
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

const updateScenario = async (scenarioId, data) => {
  const transaction = await mysqlDb.sequelize.transaction();

  try {
    const scenario = await mysqlDb.Scenario.findByPk(scenarioId, {
      transaction,
    });
    if (!scenario) {
      throw new CustomError("Scenario not found", 404);
    }

    // Process Triggers and Conditions in parallel
    await Promise.all([
      processTriggers(data.triggers, scenario.id, transaction),
      processConditions(data.conditions, scenario.id, transaction),
      processActions(data.actions, scenario.id, transaction),
    ]);

    // Update Scenario
    const updatedScenario = await scenario.update(
      {
        name: data.name,
        isEnabled: data.isEnabled,
      },
      { transaction }
    );

    await transaction.commit();
    return updatedScenario;
  } catch (error) {
    await transaction.rollback();
    throw new CustomError(error.message, 500);
  }
};

const processTriggers = async (triggers, scenarioId, transaction) => {
  const triggerPromises = triggers.map(async (trigger) => {
    if (trigger.id) {
      // Update existing trigger
      await mysqlDb.Trigger.update(trigger, {
        where: { id: trigger.id },
        transaction,
      });

      if (trigger.type === "time") {
        await mysqlDb.TimeTrigger.upsert(
          {
            id: trigger.id,
            startTime: trigger.startTime,
            endTime: trigger.endTime,
          },
          { transaction }
        );
      } else if (trigger.type === "device") {
        await mysqlDb.DeviceTrigger.upsert(
          {
            id: trigger.id,
            deviceId: trigger.deviceId,
            comparator: trigger.comparator,
            deviceStatus: trigger.deviceStatus,
          },
          { transaction }
        );
      }
    } else {
      // Create new trigger
      const newTrigger = await mysqlDb.Trigger.create(
        { ...trigger, scenarioId },
        { transaction }
      );

      if (trigger.type === "time") {
        await mysqlDb.TimeTrigger.create(
          {
            id: newTrigger.id,
            startTime: trigger.startTime,
            endTime: trigger.endTime,
          },
          { transaction }
        );
      } else if (trigger.type === "device") {
        await mysqlDb.DeviceTrigger.create(
          {
            id: newTrigger.id,
            deviceId: trigger.deviceId,
            comparator: trigger.comparator,
            deviceStatus: trigger.deviceStatus,
          },
          { transaction }
        );
      }
    }
  });

  await Promise.all(triggerPromises);
};

const processConditions = async (conditions, scenarioId, transaction) => {
  const conditionPromises = conditions.map(async (condition) => {
    if (condition.id) {
      // Update existing condition
      await mysqlDb.Condition.update(condition, {
        where: { id: condition.id },
        transaction,
      });

      if (condition.type === "time") {
        await mysqlDb.TimeCondition.upsert(
          {
            id: condition.id,
            startTime: condition.startTime,
            endTime: condition.endTime,
          },
          { transaction }
        );
      } else if (condition.type === "device") {
        await mysqlDb.DeviceCondition.upsert(
          {
            id: condition.id,
            deviceId: condition.deviceId,
            comparator: condition.comparator,
            deviceStatus: condition.deviceStatus,
          },
          { transaction }
        );
      }
    } else {
      // Create new condition
      const newCondition = await mysqlDb.Condition.create(
        { ...condition, scenarioId },
        { transaction }
      );

      if (condition.type === "time") {
        await mysqlDb.TimeCondition.create(
          {
            id: newCondition.id,
            startTime: condition.startTime,
            endTime: condition.endTime,
          },
          { transaction }
        );
      } else if (condition.type === "device") {
        await mysqlDb.DeviceCondition.create(
          {
            id: newCondition.id,
            deviceId: condition.deviceId,
            comparator: condition.comparator,
            deviceStatus: condition.deviceStatus,
          },
          { transaction }
        );
      }
    }
  });

  await Promise.all(conditionPromises);
};

const processActions = async (actions, scenarioId, transaction) => {
  const actionPromises = actions.map((action) =>
    mysqlDb.Action.upsert(
      {
        ...action,
        scenarioId,
      },
      { transaction }
    )
  );

  await Promise.all(actionPromises);
};

const deleteScenario = async (scenarioId) => {
  const transaction = await mysqlDb.sequelize.transaction();

  try {
    const scenario = await mysqlDb.Scenario.findByPk(scenarioId, {
      transaction,
    });
    if (!scenario) {
      throw new CustomError("Scenario not found", 404);
    }

    await Promise.all([
      mysqlDb.Trigger.destroy({ where: { scenarioId }, transaction }),
      mysqlDb.Condition.destroy({ where: { scenarioId }, transaction }),
      mysqlDb.Action.destroy({ where: { scenarioId }, transaction }),
    ]);

    await scenario.destroy({ transaction });

    await transaction.commit();
    return { message: "Scenario deleted successfully" };
  } catch (error) {
    await transaction.rollback();
    throw new CustomError(error.message, 500);
  }
};


const transformActions = (actions) => 
    actions.map((action) => ({
      id: uuidv4(),
      deviceId: action.deviceId,
      property: action.property,
      value: action.value,
    }));
  
  const transformTriggers = (triggers) =>
    triggers.map((trigger) => ({
      id: uuidv4(),
      type: trigger.type,
      detail: trigger.type === "device"
        ? {
            deviceId: trigger.deviceId,
            comparator: trigger.comparator,
            deviceStatus: trigger.deviceStatus,
          }
        : {
            startTime: trigger.startTime,
            endTime: trigger.endTime,
          },
    }));
  
  const transformConditions = (conditions) =>
    conditions.map((condition) => ({
      id: uuidv4(),
      type: condition.type,
      detail: condition.type === "device"
        ? {
            deviceId: condition.deviceId,
            comparator: condition.comparator,
            deviceStatus: condition.deviceStatus,
          }
        : {
            startTime: condition.startTime,
            endTime: condition.endTime,
          },
    }));

module.exports = {
  createScenario,
  getScenarioById,
  getScenariosByUser,
  updateScenario,
  deleteScenario,
};
