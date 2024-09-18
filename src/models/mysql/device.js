
module.exports = (sequelize, DataTypes) => {
    const Device = sequelize.define("Device", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("actuator", "sensor"),
            allowNull: false
        },
        macAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM("online", "offline", "error"),
            defaultValue: "online"
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id',
            }
        },
        gatewayId: {
            type: DataTypes.UUID,
            references: {
                model: 'gateways',
                key: 'id',
            }
        }
    }, {
        tableName: "devices",
        timestamps: true,
        hooks: {
            afterCreate: async (device) => {
                const mqttService = require('../../mqtt/mqttManager');
                await mqttService.onDeviceCreated(device);
            }
        }
    });

    Device.associate = function (db) {
        db.User.hasMany(Device, { foreignKey: 'userId', onDelete: 'CASCADE' });
        db.Gateway.hasMany(Device, { foreignKey: 'gatewayId', onDelete: 'CASCADE' });
        Device.belongsTo(db.User, { foreignKey: 'userId' });
        Device.belongsTo(db.Gateway, { foreignKey: 'gatewayId' });
    }

    return Device;
}