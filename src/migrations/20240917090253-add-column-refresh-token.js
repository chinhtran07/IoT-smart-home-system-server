'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Thêm cột refreshToken vào bảng users
    await queryInterface.update('users', 'refreshToken', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Tạo index cho cột refreshToken
    await queryInterface.addIndex('users', ['refreshToken'], {
      name: 'users_refresh_token_index',
      unique: false,
    });
  },

  async down (queryInterface, Sequelize) {
    // Xóa index refreshToken khi rollback
    await queryInterface.removeIndex('users', 'users_refresh_token_index');

    // Xóa cột refreshToken khi rollback
    await queryInterface.removeColumn('users', 'refreshToken');
  }
};
