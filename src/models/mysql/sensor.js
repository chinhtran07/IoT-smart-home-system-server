module.exports = (sequelize, DataTypes) => {
    const Sensor = sequelize.define('Sensor', {
        id: {
            type: DataTypes.UUID,
            references: {
                model: 'devices',
                key: 'id',
            },
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
        }
    }, {
        tableName: "sensors",
        timestamps: true,
    });

    Sensor.associate = function (db) {
        Sensor.belongsTo(db.Device, { foreignKey: 'id', onDelete: 'CASCADE' });
    };

    return Sensor;
};
