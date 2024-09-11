
module.exports = (sequelize, DataTypes) => {
    const TimeTrigger = sequelize.define('TimeTrigger', {
        startTime: {
            type: DataTypes.STRING,
            allowNull: true
        },
        endTime: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'triggers',
        timestamps: true
    });
    TimeTrigger.associate = function (db) {

        TimeTrigger.belongsTo(db.Trigger, { foreignKey: 'id', constraints: false });
    }
    return TimeTrigger;
}