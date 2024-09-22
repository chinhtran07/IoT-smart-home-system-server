'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // Thêm cột refreshToken vào bảng users
  await queryInterface.addColumn('users', 'refreshToken', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}
export async function down(queryInterface, Sequelize) {
  // Xóa cột refreshToken khi rollback
  await queryInterface.removeColumn('users', 'refreshToken');
}
