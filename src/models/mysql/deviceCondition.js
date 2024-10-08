
export default (sequelize, DataTypes) => {
    const DeviceCondition = sequelize.define('DeviceCondition', {
        id: {
            type: DataTypes.UUID,
            references: {
                model: 'conditions',
                key: 'id'
            },
            primaryKey: true,
            allowNull: false,
        },
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
        tableName: 'device_conditions',
        timestamps: true
    });

    DeviceCondition.associate = function (db) {

        DeviceCondition.belongsTo(db.Condition, { foreignKey: 'id'});
        db.Device.hasMany(DeviceCondition, { foreignKey: 'deviceId', onDelete: 'CASCADE' });
        DeviceCondition.belongsTo(db.Device, { foreignKey: 'deviceId' });
    }
    return DeviceCondition;

}