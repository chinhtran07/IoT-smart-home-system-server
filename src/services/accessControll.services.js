// accessControl.controller.js
import mongoDb from '../models/mongo/index.js';
import CustomError from '../utils/CustomError.js';

export const createAccessControl = async (ownerId, userId, permissions) => {
    try {
        const accessControl = new mongoDb.AccessControl({
            owner: ownerId,
            userId,
            permissions,
        });

        await accessControl.save();
    } catch (error) {
        throw new CustomError(error.message);
    }
};

export const getAccessControlByUserId = async (userId, ownerId) => {
    try {
        const accessControl = await mongoDb.AccessControl.findOne({
            userId: userId,
            owner: ownerId,
        });

        if (!accessControl) {
            throw new CustomError("Not Found", 404);
        }

        return accessControl;
    } catch (error) {
        throw new CustomError(error.message);
    }
};

export const updateAccessControl = async (ownerId, userId, permissions) => {
    try {
        const updatedAccessControl = await mongoDb.AccessControl.findOneAndUpdate(
            { owner: ownerId, userId: userId },
            { permissions },
            { new: true, runValidators: true }
        );

        if (!updatedAccessControl) {
            throw new CustomError("Not Found", 404);
        }

        return updatedAccessControl;
    } catch (error) {
        throw new CustomError(error.message);
    }
};

export const getGrantedUsersByOwner = async (ownerId) => {
    try {
        const accessControls = await mongoDb.AccessControl.find({ owner: ownerId });

        if (!accessControls.length) {
            throw new CustomError("No users found for this owner", 404);
        }

        const users = accessControls.map(ac => ({
            user: ac.userId,
            permissions: ac.permissions,
        }));

        return users;
    } catch (error) {
        throw new CustomError(error.message);
    }
};

export const deleteAccessControl = async (ownerId, userId) => {
    try {
        const deletedItem = await mongoDb.AccessControl.findOneAndDelete({
            owner: ownerId,
            userId: userId,
        });

        if (!deletedItem) {
            throw new CustomError("Access control not Found", 404);
        }

        return deletedItem;
    } catch (error) {
        throw new CustomError(error.message);
    }
};

export default CustomError;
