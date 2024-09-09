const accessControlService = require("../services/accessControll.services");
const User = require("../models/User");

const grantPermission = async (req, res, next) => {
  try {
    const { userId, permissions } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      next(error);
    }
    const result = await accessControlService.createAccessControl(
      userId,
      permissions
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAccessControl = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      next(error);
    }
    const accessControl = await accessControlService.getAccessControlByUserId(
      userId,
      req.user._id
    );
    res.status(200).json(accessControl);
  } catch (error) {
    next(error);
  }
};

const updateAccessControl = async (req, res, next) => {
  try {
    const userId = req.params.id || req.body.userId;
    const { permissions } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      next(error);
    }
    await accessControlService.updateAccessControl(
      req.user._id,
      userId,
      permissions
    );

    res.status(200);
  } catch (error) {
    next(error);
  }
};

const getGrantedUsersByOwner = async (req, res, next) => {
  try {
    const users = await accessControlService.getGrantedUsersByOwner(
      req.user._id
    );
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const deleteAccessControl = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await accessControlService.deleteAccessControl(req.user._id, userId);
    res.status(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  grantPermission,
  getAccessControl,
  updateAccessControl,
  getGrantedUsersByOwner,
  deleteAccessControl,
};
