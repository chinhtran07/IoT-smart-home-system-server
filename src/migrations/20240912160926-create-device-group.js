'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('device_groups', {
      deviceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'devices', // Ensure this matches the table name
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true, // Primary key for many-to-many junction table
      },
      groupId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'groups', // Ensure this matches the table name
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true, // Primary key for many-to-many junction table
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
    await queryInterface.dropTable('device_groups');
  }
};
