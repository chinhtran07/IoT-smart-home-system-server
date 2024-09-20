'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('recurring_schedules', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            scheduleId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'schedules',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            recurrencePattern: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            endDate: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            timeOfDay: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            timezone: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },
    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('recurring_schedules');
    }
};
