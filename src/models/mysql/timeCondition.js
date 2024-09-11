
module.exports = (sequelize, DataTypes) => {
    const TimeCondition = sequelize.define('TimeCondition', {
        startTime: {
            type: DataTypes.STRING,
            allowNull: true
        },
        endTime: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'conditions',
        timestamps: true
    });

    TimeCondition.associate = function (db) {

        TimeCondition.belongsTo(db.Condition, { foreignKey: 'id', constraints: false });
    }
    return TimeCondition;
}