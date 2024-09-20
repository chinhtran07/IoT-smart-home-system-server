import bcrypt from "bcryptjs";
import mysqlDb from "../models/mysql/index.js";
import CustomError from "../utils/CustomError.js";

export const getProfile = async (userId) => {
  try {
    const user = await mysqlDb.User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "username", "refreshToken"],
      },
    });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, updateData) => {
  try {
    if (Object.keys(updateData).length === 0) {
      throw new CustomError("Empty updated data", 400);
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

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await mysqlDb.User.findByPk(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new CustomError("Password does not match", 400);
    }

    user.password = newPassword;
    await user.save();

    return true;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (queryParams) => {
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

export const deleteUser = async (userId) => {
  try {
    const user = await mysqlDb.User.findOne({ where: { id: userId } });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    await user.destroy();
    return { message: "User deleted successfully" };
  } catch (error) {
    throw error;
  }
};
