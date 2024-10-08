'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('actions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      scenarioId: {
        type: Sequelize.UUID,
        references: {
          model: 'scenarios', // Đảm bảo tên bảng khớp
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      scheduleId: {
        type: Sequelize.UUID,
        references: {
          model: 'schedules', // Đảm bảo tên bảng khớp
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      deviceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'devices',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('modify', 'control'),
        defaultValue: 'control',
        allowNull: false,
      },
      property: {
        type: Sequelize.STRING,
        defaultValue: 'control',
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('actions');
  }
};
