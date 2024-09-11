
module.exports = (sequelize, DataTypes) => {
    const DeviceCondition = sequelize.define('DeviceCondition', {
        deviceId: {
            type: DataTypes.UUID,
            references: {
                model: 'devices',
                key: 'id',
            },
            allowNull: true
        },
        comparator: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deviceStatus: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'conditions',
        timestamps: true
    });

    DeviceCondition.associate = function (db) {

        DeviceCondition.belongsTo(db.Condition, { foreignKey: 'id', constraints: false });
        db.Device.hasMany(DeviceCondition, { foreignKey: 'deviceId', onDelete: 'CASCADE' });
        DeviceCondition.belongsTo(db.Device, { foreignKey: 'deviceId' });
    }
    return DeviceCondition;

}