import User from '../models/user.model.js';
import CustomError from '../utils/CustomError.js';
import * as accessControlService from "../services/accessControl.service.js";

export const grantPermission = async (req, res, next) => {
    try {
        const { userId, permissions } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            next(new CustomError("User not found", 404));
            return;
        }

        const result = await accessControlService.createAccessControl(
            req.user._id, 
            userId,
            permissions
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getAccessControl = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) {
            next(new CustomError("User not found", 404));
            return;
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

export const updateAccessControl = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const { permissions } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            next(new CustomError("User not found", 404));
            return;
        }

        await accessControlService.updateAccessControl(
            req.user._id,
            userId,
            permissions
        );

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const getGrantedUsersByOwner = async (req, res, next) => {
    try {
        const users = await accessControlService.getGrantedUsersByOwner(req.user._id);
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const deleteAccessControl = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        await accessControlService.deleteAccessControl(req.user._id, userId);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
