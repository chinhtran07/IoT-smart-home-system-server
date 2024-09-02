const userServices = require("../services/user.services");
const CustomError = require("../utils/CustomError");

const getProfile = async (req, res, next) => {
  try {
    const user = await userServices.getProfile(req.params.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userServices.getProfile(req.user._id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updateData = req.body;
    const updatedUser = await userServices.updateUserProfile(
      req.user._id,
      updateData
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userServices.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );
    res.status(200);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userServices.deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userServices.getAllUsers(req.query);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getCurrentUser,
  updateUser,
  changePassword,
  deleteUser,
  getAllUsers,
};
