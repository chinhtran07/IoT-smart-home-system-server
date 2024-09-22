'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('conditions', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
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
    },
    type: {
      type: Sequelize.ENUM('time', 'device'),
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('conditions');
}
