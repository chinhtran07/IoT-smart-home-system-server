export default (sequelize, DataTypes) => {
    const RecurringSchedule = sequelize.define('RecurringSchedule', {
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
        recurrencePattern: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        timeOfDay: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'recurring_schedules',
        timestamps: true,
    });

    RecurringSchedule.associate = function (models) {
        RecurringSchedule.belongsTo(models.Schedule, { foreignKey: 'scheduleId' });
    };

    return RecurringSchedule;
};
