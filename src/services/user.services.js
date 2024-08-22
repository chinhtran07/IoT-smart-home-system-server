const User = require('../models/User');
const bcrypt = require('bcryptjs');
const CustomError = require('../utils/CustomError');
const paginate = require('../utils/paginator');

const getProfile = async(userId) => {
    const user = await User.findById(userId).select('-password');
    return user;
};

const updateUserProfile = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
  
    const isMatch = await bcrypt.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new CustomError('Current password is incorrect', 400);
    }
  
    user.password = newPassword;
  
    await user.save();
    return { message: 'Password updated successfully' };
};

const getAllUsers = async (queryParams) => {
    const query = {};
    const options = {
      page: queryParams.page,
      limit: queryParams.limit
    };

    return await paginate(User, query, options);
};

const deleteUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    await user.remove();
    return { message: 'User deleted successfully' };
  };

module.exports = {
    getProfile,
    updateUserProfile,
    changePassword,
    getAllUsers,
    deleteUser
};