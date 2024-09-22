
export default (Sequelize, DataTypes) => {
    const Scene = Sequelize.define('Scene', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id'
            },
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'scenes',
        timestamps: true,
    });

    Scene.associate = function (db) {

        db.User.hasMany(Scene, { foreignKey: 'userId', onDelete: 'CASCADE' });
        Scene.belongsTo(db.User, { foreignKey: 'userId' });
    }

    return Scene;
}