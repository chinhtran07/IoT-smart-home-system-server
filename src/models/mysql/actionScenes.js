export default (sequelize, DataTypes) => {
    const ActionScene = sequelize.define('ActionScene', {
        actionId: {
            type: DataTypes.UUID,
            references: {
                model: 'actions',
                key: 'id',
            },
            primaryKey: true
        },
        sceneId: {
            type: DataTypes.UUID,
            references: {
                model: "scenes",
                key: "id",
            },
            primaryKey: true,
        }
    }, {
        tableName: "action_scenes",
        timestamps: true,
    });

    ActionScene.associate = function (db) {
        db.Action.belongsToMany(db.Scene, { through: ActionScene, foreignKey: "actionId", onDelete: "CASCADE" });
        db.Scene.belongsToMany(db.Action, { through: ActionScene, foreignkey: 'sceneId', onDelete: 'CASCADE' });
    }


    return ActionScene;
}