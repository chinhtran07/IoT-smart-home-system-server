module.exports = (sequelize, DataTypes) => {
    const ActionScenario = sequelize.define('ActionScenario', {
        deviceId: {
            type: DataTypes.UUID,
            references: {
                model: 'actions',
                key: 'id',
            },
            primaryKey: true
        },
        scenarioId: {
            type: DataTypes.UUID,
            references: {
                model: "scenarios",
                key: "id",
            },
            primaryKey: true,
        }
    }, {
        tableName: "action_scenarios",
        timestamps: true,
    });

    ActionScenario.associate = function (db) {
        db.Action.belongsToMany(db.Scenario, { through: ActionScenario, foreignKey: "actionId", onDelete: "CASCADE" });
        db.Scenario.belongsToMany(db.Action, { through: ActionScenario, foreignkey: 'scenarioId', onDelete: 'CASCADE' });
    }


    return ActionScenario;
}