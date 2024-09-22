'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('actuators', {
      id: {
        type: Sequelize.UUID,
        references: {
          model: 'devices', 
          key: 'id',
        },
        primaryKey: true,
        onDelete: 'CASCADE',
        allowNull: false,
      },
      type: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      properties: {
        type: Sequelize.JSON,
        allowNull: false
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
    await queryInterface.dropTable('actuators');
  }
};
