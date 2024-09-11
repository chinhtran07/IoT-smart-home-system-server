
module.exports = (sequelize, DataTypes) => {
    const Sensor = sequelize.define('Sensor', {
        type: { type: DataTypes.STRING, allowNull: false },
        unit: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
    });

    Sensor.associate = function (db) {

        Sensor.belongsTo(db.Device, { foreignKey: 'id', constraints: false });
    }
    return Sensor;
}