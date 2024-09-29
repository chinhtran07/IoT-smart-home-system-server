'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('device_groups', {
      deviceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'devices', 
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true, 
      },
      groupId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'groups', 
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('device_groups');
  }
};
