const bcrypt = require("bcryptjs");
const paginate = require("../utils/paginator");
const mysqlDb = require('../models/mysql');

const getProfile = async (userId) => {
  try {
    const user = await mysqlDb.User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserProfile = async (userId, updateData) => {
  try {
    const [updated] = await mysqlDb.User.update(updateData, {
      where: { id: userId },
      returning: true
    });
    if (!updated) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    return updated[0];
  } catch (error) {
    throw error;
  }
};


const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await mysqlDb.User.findOne({ where: { id: userId } });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error("Password not match");
      error.status = 400;
      throw error;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async (queryParams) => {
  try {
    const { page = 1, limit = 10 } = queryParams;
    const offset = (page - 1) * limit;

    const { rows, count } = await mysqlDb.User.findAndCountAll({
      limit,
      offset
    });

    return {
      total: count,
      users: rows
    };
  } catch (error) {
    throw error;
  }
};


const deleteUser = async (userId) => {
  try {
    const user = await mysqlDb.User.findOne({ where: { id: userId } });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    await user.destroy();
    return { message: "User deleted successfully" };
  } catch (error) {
    throw error;
  }
};



module.exports = {
  getProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  deleteUser,
};
