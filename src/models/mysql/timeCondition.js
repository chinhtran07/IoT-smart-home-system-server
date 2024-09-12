
module.exports = (sequelize, DataTypes) => {
    const TimeCondition = sequelize.define('TimeCondition', {
        id: {
            type: DataTypes.UUID,
            references: {
                model: 'conditions',
                key: 'id'
            },
            primaryKey: true,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.STRING,
            allowNull: true
        },
        endTime: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'time_conditions',
        timestamps: true
    });

    TimeCondition.associate = function (db) {

        TimeCondition.belongsTo(db.Condition, { foreignKey: 'id' });
    }
    return TimeCondition;
}