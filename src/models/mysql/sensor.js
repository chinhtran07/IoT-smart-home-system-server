module.exports = (sequelize, DataTypes) => {
    const Sensor = sequelize.define('Sensor', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deviceId: {
            type: DataTypes.UUID,
            references: {
                model: 'devices',
                key: 'id',
            },
            allowNull: false,
        }
    }, {
        tableName: "sensors",
        timestamps: true,
    });

    Sensor.associate = function (db) {
        Sensor.belongsTo(db.Device, { foreignKey: 'deviceId', onDelete: 'CASCADE' });
    };

    return Sensor;
};
