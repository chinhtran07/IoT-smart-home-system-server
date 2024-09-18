'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('schedules', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // Ensure this matches the table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('one-time', 'recurring'),
        allowNull: false,
      },
      interval: {
        type: Sequelize.ENUM('daily', 'weekly', 'monthly'),
        allowNull: true,
      },
      daysOfWeek: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      timeOfDay: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('schedules');
  }
};
