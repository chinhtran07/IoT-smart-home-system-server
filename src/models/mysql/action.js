
export default (sequelize, DataTypes) => {
    const Action = sequelize.define('Action', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        deviceId: {
            type: DataTypes.UUID,
            references: {
                model: "devices",
                key: "id"
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        property: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING, 
            allowNull: false
        }
    }, {
        tableName: "actions",
        timestamps: true, 
    });
    
    Action.associate = function (db) {
        db.Device.hasMany(Action, { foreignKey: 'deviceId', onDelete: 'CASCADE' });
        Action.belongsTo(db.Device, { foreignKey: 'deviceId' });
    }
    

    return Action;
}