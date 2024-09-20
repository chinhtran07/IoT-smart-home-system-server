'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('schedules', 'interval');
    await queryInterface.removeColumn('schedules', 'daysOfWeek');
    await queryInterface.removeColumn('schedules', 'timeOfDay');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('schedules', 'interval', {
      type: Sequelize.ENUM('daily', 'weekly', 'monthly'),
      allowNull: true,
    });

    await queryInterface.addColumn('schedules', 'daysOfWeek', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn('schedules', 'timeOfDay', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
