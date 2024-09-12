module.exports = (sequelize, DataTypes) => {
    const Actuator = sequelize.define('Actuator', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'devices',
                key: 'id',
            },
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        action: {
            type: DataTypes.ENUM('modify', 'control'),
            defaultValue: 'control',
            allowNull: false
        },
        properties: {
            type: DataTypes.JSON,
            allowNull: false
        }
    }, {
        tableName: "actuators",
        timestamps: true,
    });

    Actuator.associate = function (db) {
        Actuator.belongsTo(db.Device, { foreignKey: 'id', onDelete: 'CASCADE' });
    };

    return Actuator;
};
