'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('actions', 'scheduleId');
  await queryInterface.removeColumn('actions', 'scenarioId');
  await queryInterface.removeColumn('actions', 'type');
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('actions', 'scheduleId', {
    type: Sequelize.UUID,
    references: {
      model: 'schedules',
      key: 'id',
    },
    onDelete: 'CASCADE',
  });

  await queryInterface.addColumn('actions', 'scenarioId', {
    type: Sequelize.UUID,
    references: {
      model: 'scenarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  });

  await queryInterface.addColumn('actions', 'type', {
    type: Sequelize.ENUM('modify', 'control'),
    defaultValue: 'control',
    allowNull: false,
  });
}
