
export default (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.ENUM('one-time', 'recurring'),
            allowNull: false,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    }, {
        tableName: "schedules",
        timestamps: true,
    });


    Schedule.associate = function (db) {
        db.User.hasMany(Schedule, { foreignKey: 'userId', onDelete: 'CASCADE' });
        Schedule.belongsTo(db.User, { foreignKey: 'userId' });
    }
    return Schedule;
}