'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('action_scenes', {
      actionId: {
        type: Sequelize.UUID, 
        allowNull: false,
        references: {
          model: 'actions',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      sceneId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'scenes',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("scene_actions");
  }
};
