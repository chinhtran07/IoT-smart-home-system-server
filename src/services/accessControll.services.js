const AccessControl = require("../models/AccessControl");

const createAccessControl = async (userId, permissions) => {
  try {
    const accessControl = new AccessControl({
      owner: req.user._id,
      userId,
      permissions,
    });

    await accessControl.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAccessControlByUserId = async (userId, onwerId) => {
  try {
    const accessControl = await AccessControl.findOne({
      userId: userId,
      owner: onwerId,
    })
      .populate("owner")
      .populate("userId")
      .populate("permissions.device")
      .populate("permissions.group");

    if (!accessControl) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    return accessControl;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateAccessControl = async (ownerId, userId, permissions) => {
  try {
    const updatedAccessControl = await AccessControl.findOneAndUpdate(
      { owner: ownerId },
      { userId },
      { permissions },
      { new: true, runValidators: true }
    )
      .populate("owner")
      .populate("userId")
      .populate("permissions.device")
      .populate("permissions.group");

    if (!updatedAccessControl) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getGrantedUsersByOwner = async (ownerId) => {
  try {
    const accessControls = await AccessControl.find({ owner: ownerId })
      .populate("userId", "name email")
      .populate("permissions.device")
      .populate("permissions.group");

    if (!accessControls.length) {
      const error = new Error("No users found for this owner");
      error.status = 404;
      throw error;
    }

    const users = accessControls.map((ac) => ({
      user: ac.userId,
      permissions: ac.permissions,
    }));

    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteAccessControl = async (ownerId, userId) => {
  try {
    const deletedItem = await AccessControl.findOneAndDelete({
      owner: ownerId,
      userId: userId,
    });

    if (!deletedItem) {
      const error = new Error("Access control not Found");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createAccessControl,
  getAccessControlByUserId,
  updateAccessControl,
  getGrantedUsersByOwner,
  deleteAccessControl,
};
