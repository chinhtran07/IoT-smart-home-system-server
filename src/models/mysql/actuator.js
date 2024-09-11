
module.exports = (sequelize, DataTypes) => {
    const Actuator = sequelize.define('Actuator', {
        type: { type: DataTypes.STRING, allowNull: false },
        action: {
            type: DataTypes.ENUM('modify', 'control'),
            default: 'control',
            allowNull: false
        },
        properties: {
            type: DataTypes.JSON,
            allowNull: false
        }
    }, {
        timestamps: true,
    });

    Actuator.associate = function (db) {
        Actuator.belongsTo(db.Device, { foreignKey: 'id', constraints: false });
    }

    return Actuator;
}