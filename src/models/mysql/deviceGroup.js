
export default (sequelize, DataTypes) => {
    const DeviceGroup = sequelize.define("DeviceGroup", {
        deviceId: {
            type: DataTypes.UUID,
            references: {
                model: 'devices',
                key: 'id',
            },
            primaryKey: true
        },
        groupId: {
            type: DataTypes.UUID,
            references: {
                model: 'groups',
                key: 'id',
            },
            primaryKey: true
        }
    }, {
        tableName: "device_groups",
        timestamps: true,
    });

    DeviceGroup.associate = function (db) {
        db.Device.belongsToMany(db.Group, { through: DeviceGroup, foreignkey: 'userId', onDelete: 'CASCADE' });
        db.Group.belongsToMany(db.Device, { through: DeviceGroup, foreignkey: 'groupId', onDelete: 'CASCADE' });
    }


    return DeviceGroup;
}