
export default (sequelize, DataTypes) => {
    const Scenario = sequelize.define('Scenario', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id',
            },
            allowNull: false
        },
        isEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName:"scenarios",
        timestamps: true,
    });
    Scenario.associate = function (db) {

        db.User.hasMany(Scenario, { foreignKey: 'userId', onDelete: 'CASCADE' });
        Scenario.belongsTo(db.User, { foreignKey: 'userId' });
    }
    return Scenario;
}