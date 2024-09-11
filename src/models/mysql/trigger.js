
module.exports = (sequelize, DataTypes) => {
    const Trigger = sequelize.define('Trigger', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        scenarioId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'scenarios',
                key: 'id'
            },
        },
        type: {
            type: DataTypes.ENUM('time', 'device'),
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Trigger.associate = function (db) {

        db.Scenario.hasMany(Trigger, { foreignKey: 'scenarioId', onDelete: 'CASCADE' });
        Trigger.belongsTo(db.Scenario, { foreignKey: 'scenarioId' });
    }
    return Trigger;
}