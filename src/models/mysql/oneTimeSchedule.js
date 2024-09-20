export default (sequelize, DataTypes) => {
    const OneTimeSchedule = sequelize.define('OneTimeSchedule', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        scheduleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Schedule',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        oneTimeDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'one_time_schedules',
        timestamps: true,
    });

    OneTimeSchedule.associate = function (models) {
        OneTimeSchedule.belongsTo(models.Schedule, { foreignKey: 'scheduleId' });
    };

    return OneTimeSchedule;
};
