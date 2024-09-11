const AccessControl = require("../models/AccessControl");

const createAccessControl = async (ownerId,userId, permissions) => {
  try {
    const accessControl = new AccessControl({
      owner: ownerId,
      userId,
      permissions,
    });

    await accessControl.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAccessControlByUserId = async (userId, ownerId) => {
  try {
    const accessControl = await AccessControl.findOne({
      userId: userId,
      owner: ownerId,
    });

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
      { owner: ownerId, userId: userId },
      { permissions },
      { new: true, runValidators: true }
    );

    if (!updatedAccessControl) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    
    return updatedAccessControl;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getGrantedUsersByOwner = async (ownerId) => {
  try {
    const accessControls = await AccessControl.find({ owner: ownerId });

    if (!accessControls.length) {
      const error = new Error("No users found for this owner");
      error.status = 404;
      throw error;
    }

    const users = accessControls.map(ac => ({
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

    return deletedItem;
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
