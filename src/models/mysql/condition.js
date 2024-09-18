
module.exports = (sequelize, DataTypes) => {
    const Condition = sequelize.define('Condition', {
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
        tableName: "conditions",
        timestamps: true
    });

    Condition.associate = function (db) {
        db.Scenario.hasMany(Condition, { foreignKey: 'scenarioId', onDelete: 'CASCADE' });
        Condition.belongsTo(db.Scenario, { foreignKey: 'scenarioId' });
    }
    return Condition;
}