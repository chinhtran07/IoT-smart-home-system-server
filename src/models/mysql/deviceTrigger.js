
export default (sequelize, DataTypes) => {
    const DeviceTrigger = sequelize.define('DeviceTrigger', {
        id: {
            type: DataTypes.UUID,
            references: {
                model: 'triggers',
                key: 'id'
            },
            primaryKey: true
        },
        deviceId: {
            type: DataTypes.UUID,
            references: {
                model: 'devices',
                key: 'id',
            },
            allowNull: false
        },
        comparator: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deviceStatus: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'device_triggers',
        timestamps: true
    });

    DeviceTrigger.associate = function (db) {
        DeviceTrigger.belongsTo(db.Trigger, { foreignKey: 'id'});
        db.Device.hasMany(DeviceTrigger, { foreignKey: 'deviceId', onDelete: 'CASCADE' });
        DeviceTrigger.belongsTo(db.Device, { foreignKey: 'deviceId' });
    }

    return DeviceTrigger;

}