'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('action_scenarios', {
      deviceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'actions',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true, 
      },
      scenarioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'scenarios', 
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
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
    await queryInterface.dropTable('action_scenarios');
  }
};
