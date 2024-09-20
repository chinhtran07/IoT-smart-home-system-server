
export default (sequelize, DataTypes) => {
    const Group = sequelize.define("Group", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("room", "category", "custom"),
            defaultValue: "custom"
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id',
            }
        }
    }, {
        tableName: "groups",
        timestamps: true
    });
    Group.associate = function (db) {

        db.User.hasMany(Group, { foreignKey: 'userId', onDelete: 'CASCADE' });
        Group.belongsTo(db.User, { foreignKey: 'userId' });
    }
    return Group;
}