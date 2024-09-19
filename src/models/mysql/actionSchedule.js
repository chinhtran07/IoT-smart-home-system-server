module.exports = (sequelize, DataTypes) => {
    const ActionSchedule = sequelize.define('ActionSchedule', {
        deviceId: {
            type: DataTypes.UUID,
            references: {
                model: 'actions',
                key: 'id',
            },
            primaryKey: true
        },
        scheduleId: {
            type: DataTypes.UUID,
            references: {
                model: "schedules",
                key: "id",
            },
            primaryKey: true,
        }
    }, {
        tableName: "action_schedule",
        timestamps: true,
    });

    ActionSchedule.associate = function (db) {
        db.Action.belongsToMany(db.Schedule, { through: ActionSchedule, foreignKey: "actionId", onDelete: "CASCADE" });
        db.Schedule.belongsToMany(db.Action, { through: ActionSchedule, foreignkey: 'scheduleId', onDelete: 'CASCADE' });
    }


    return ActionSchedule;
}