'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("users", 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn("users", "avatarURI", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "https://res.cloudinary.com/dk4uoxtsx/image/upload/v1714275648/ghflife78nwekmneusaw.jpg",
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
