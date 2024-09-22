'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('triggers', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    scenarioId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'scenarios',
        key: 'id',
      },
      onDelete: 'CASCADE', // Ensure cascading deletion
      onUpdate: 'CASCADE',
    },
    type: {
      type: Sequelize.ENUM('time', 'device'),
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
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('triggers');
}
