const mysqlDb = require('../models/mysql');

const createScenario = async (data, userId) => {
    const transaction = await mysqlDb.sequelize.transaction();

    try {
        // Create Scenario
        const scenario = await mysqlDb.Scenario.create({
            name: data.name,
            userId: userId,
            isEnabled: data.isEnabled
        }, { transaction });

        // Create Triggers
        const triggers = await mysqlDb.Trigger.bulkCreate(
            data.triggers.map(trigger => ({
                ...trigger,
                scenarioId: scenario.id,  // Associate with Scenario
            })),
            { transaction }
        );

        // Create Conditions
        const conditions = await mysqlDb.Condition.bulkCreate(
            data.conditions.map(condition => ({
                ...condition,
                scenarioId: scenario.id,  // Associate with Scenario
            })),
            { transaction }
        );

        // Create Actions
        const actions = await mysqlDb.Action.bulkCreate(
            data.actions.map(action => ({
                ...action,
                scenarioId: scenario.id,  // Associate with Scenario
            })),
            { transaction }
        );

        await transaction.commit(); // Commit transaction
        return {scenario, triggers, conditions, actions};
    } catch (error) {
        await transaction.rollback(); // Rollback transaction in case of error
        throw new Error(error.message);
    }
};

const getScenarioById = async (scenarioId) => {
    try {
        const scenario = await mysqlDb.Scenario.findByPk(scenarioId, {
            include: [
                { model: Trigger, include: [DeviceTrigger, TimeTrigger] },
                { model: Condition, include: [DeviceCondition, TimeCondition] },
                { model: Action }
            ]  // Populate associated data
        });

        if (!scenario) {
            const error = new Error("Scenario not found");
            error.status = 404;
            throw error;
        }

        return scenario;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getScenariosByUser = async (userId) => {
    try {
        const scenarios = await mysqlDb.Scenario.findAll({
            where: { userId },
            attributes: ["id", "name", "isEnabled"],
        });

        return scenarios;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateScenario = async (scenarioId, data) => {
    const transaction = await mysqlDb.Scenario.sequelize.transaction();

    try {
        const scenario = await mysqlDb.Scenario.findByPk(scenarioId, { transaction });

        if (!scenario) {
            throw new Error("Scenario not found");
        }

        await mysqlDb.Trigger.destroy({ where: { scenarioId: scenarioId }, transaction });
        await mysqlDb.Condition.destroy({ where: { scenarioId: scenarioId }, transaction });
        await mysqlDb.Action.destroy({ where: { scenarioId: scenarioId }, transaction });

        const newTriggers = await mysqlDb.Trigger.bulkCreate(
            data.triggers.map(trigger => ({
                ...trigger,
                scenarioId: scenario.id
            })),
            { transaction }
        );
        const newConditions = await mysqlDb.Condition.bulkCreate(
            data.conditions.map(condition => ({
                ...condition,
                scenarioId: scenario.id
            })),
            { transaction }
        );
        const newActions = await mysqlDb.Action.bulkCreate(
            data.actions.map(action => ({
                ...action,
                scenarioId: scenario.id
            })),
            { transaction }
        );

        const updatedScenario = await scenario.update(
            {
                name: data.name,
                isEnabled: data.isEnabled
            },
            { transaction }
        );

        await transaction.commit(); 
        return updatedScenario;
    } catch (error) {
        await transaction.rollback(); 
        throw new Error(error.message);
    }
};

const deleteScenario = async (scenarioId) => {
    const transaction = await mysqlDb.Scenario.sequelize.transaction();

    try {
        const scenario = await mysqlDb.Scenario.findByPk(scenarioId, { transaction });

        if (!scenario) {
            throw new Error("Scenario not found");
        }

        // Delete associated Triggers, Conditions, and Actions
        await mysqlDb.Trigger.destroy({ where: { scenarioId }, transaction });
        await mysqlDb.Condition.destroy({ where: { scenarioId }, transaction });
        await mysqlDb.Action.destroy({ where: { scenarioId }, transaction });

        // Delete Scenario
        await scenario.destroy({ transaction });

        await transaction.commit(); // Commit transaction
        return { message: "Scenario deleted successfully" };
    } catch (error) {
        await transaction.rollback(); // Rollback transaction in case of error
        throw new Error(error.message);
    }
};

module.exports = {
    createScenario,
    getScenarioById,
    getScenariosByUser,
    updateScenario,
    deleteScenario
};
