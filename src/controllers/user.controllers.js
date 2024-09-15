const userServices = require("../services/user.services");

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
    const {firstName, lastName, email, phone} = req.body;
    await userServices.updateUserProfile(
      req.user._id,
      {firstName, lastName, email, phone}
    );
    res.sendStatus(204);
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
    res.sendStatus(204);
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
