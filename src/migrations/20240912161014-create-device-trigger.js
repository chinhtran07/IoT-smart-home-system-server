'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('device_triggers', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'triggers', // Ensure this matches the table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    deviceId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'devices', // Ensure this matches the table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    comparator: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    deviceStatus: {
      type: Sequelize.STRING,
      allowNull: false,
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
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('device_triggers');
}
