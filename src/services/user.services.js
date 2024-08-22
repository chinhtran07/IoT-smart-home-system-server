const User = require('../models/User');
const bcrypt = require('bcryptjs');
const CustomError = require('../utils/CustomError');

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
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  
    await user.save();
    return { message: 'Password updated successfully' };
};

const getAllUsers = async () => {
    return await User.find().select('-password');
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