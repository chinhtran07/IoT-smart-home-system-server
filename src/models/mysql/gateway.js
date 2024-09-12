
module.exports = (sequelize, DataTypes) => {
    const Gateway = sequelize.define("Gateway", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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
                key: "id",
            }
        }
    }, {
        tableName: "gateways",
        timestamps: true
    });
    Gateway.associate = function (db) {

        db.User.hasMany(Gateway, { foreignKey: 'userId', onDelete: 'CASCADE' });
        Gateway.belongsTo(db.User, { foreignKey: 'userId' });
    }

    Gateway.afterCreate(async (gateway, options) => {
        const mqttService = require('../../mqtt/mqttClient');
        await mqttService.onGatewayCreated(gateway);
    });
    
    return Gateway;
}