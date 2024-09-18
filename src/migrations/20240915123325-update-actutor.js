"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("actuators", "action");
    await queryInterface.removeColumn("actions", "type");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("actuators", "action", {
      type: Sequelize.ENUM("modify", "control"),
      defaultValue: "control",
      allowNull: false,
    });

    await queryInterface.addColumn("actions", "type", {
      type: Sequelize.ENUM("modify", "control"),
      defaultValue: "control",
      allowNull: false,
    });
  },
};
