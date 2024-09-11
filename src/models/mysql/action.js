
module.exports = (sequelize, DataTypes) => {
    const Action = sequelize.define('Action', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        scenarioId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'scenarios',
                key: 'id',
            },
        },
        scheduleId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'schedules',
                key: 'id'
            },
        },
        deviceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'devices',
                key: 'id',
            },
        },
        type: {
            type: DataTypes.ENUM('modify', 'control'),
            allowNull: false,
            defaultValue: 'control'
        },
        property: {
            type: DataTypes.STRING,
            defaultValue: 'control'
        },
        value: {
            type: DataTypes.STRING, 
            allowNull: false
        }
    }, {
        timestamps: true, 
    });
    
    Action.associate = function (db) {
        db.Scenario.hasMany(Action, { foreignKey: 'scenarioId', onDelete: 'CASCADE' });
        db.Device.hasMany(Action, { foreignKey: 'deviceId', onDelete: 'CASCADE' });
        db.Schedule.hasMany(Action, { foreignKey: 'scheduleId', onDelete: 'CASCADE' });
        Action.belongsTo(db.Scenario, { foreignKey: 'scenarioId' });
        Action.belongsTo(db.Device, { foreignKey: 'deviceId' });
        Action.belongsTo(db.Schedule, { foreignKey: 'scheduleId' });
    }
    

    return Action;
}