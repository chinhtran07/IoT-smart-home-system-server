'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('device_conditions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'conditions',
          key: 'id'
        }
      },
      deviceId: {
        type: Sequelize.UUID,
        references: {
          model: 'devices',
          key: 'id',
        },
        allowNull: true,
        onDelete: 'CASCADE',
      },
      comparator: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deviceStatus: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('device_conditions');
  }
};
