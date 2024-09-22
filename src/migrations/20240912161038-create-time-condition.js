'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('time_conditions', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'conditions',
        key: 'id'
      },
      onDelete: 'CASCADE',
    },
    startTime: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    endTime: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('time_conditions');
}
