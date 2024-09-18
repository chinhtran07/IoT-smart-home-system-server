
module.exports = (sequelize, DataTypes) => {
    const TimeTrigger = sequelize.define('TimeTrigger', {
        id: {
            type: DataTypes.UUID,
            references: {
                model: 'triggers',
                key: 'id'
            },
            primaryKey: true
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
        tableName: 'time_triggers',
        timestamps: true
    });
    TimeTrigger.associate = function (db) {

        TimeTrigger.belongsTo(db.Trigger, { foreignKey: 'id'});
    }
    return TimeTrigger;
}