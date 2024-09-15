const bcrypt = require("bcryptjs");
const paginate = require("../utils/paginator");
const mysqlDb = require("../models/mysql");
const CustomError = require("../utils/CustomError");

const getProfile = async (userId) => {
  try {
    const user = await mysqlDb.User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "username"],
      },
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

    if (Object.keys(updateData).length < 0) {
      return new CustomError("Emtpy updated data", 400);
    }

    const [updated] = await mysqlDb.User.update(updateData, {
      where: { id: userId },
    });

    if (updated === 0) {
      throw new CustomError("Updated data is invalid", 400);
    }

    const updatedUser = await mysqlDb.User.findByPk(userId);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await mysqlDb.User.findByPk(userId);
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

    user.password = newPassword;
    await user.save();

    return true;
  } catch (error) {
    throw error;
  }
};

//test
const getAllUsers = async (queryParams) => {
  try {
    const { page = 1, limit = 10 } = queryParams;
    const offset = (page - 1) * limit;

    const { rows, count } = await mysqlDb.User.findAndCountAll({
      limit,
      offset,
    });

    return {
      total: count,
      users: rows,
    };
  } catch (error) {
    throw error;
  }
};

//test
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
