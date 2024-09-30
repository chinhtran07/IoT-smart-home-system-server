import * as accessControlService from '../services/accessControll.services.js';
import redisClient from '../config/redis.config.js'; // Adjust path as necessary

export const grantPermission = async (req, res, next) => {
    try {
        const { userId, permissions } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }
        const result = await accessControlService.createAccessControl(
            req.user.id,
            userId,
            permissions
        );

        await redisClient.del(`accessControl:${userId}:${req.user.id}`);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getAccessControl = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const cacheKey = `accessControl:${userId}:${req.user.id}`;

        const cachedAccessControl = await redisClient.get(cacheKey);
        if (cachedAccessControl) {
            return res.status(200).json(JSON.parse(cachedAccessControl));
        }

        const user = await mysqlDb.User.findByPk(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }
        const accessControl = await accessControlService.getAccessControlByUserId(
            userId,
            req.user.id
        );

        await redisClient.set(cacheKey, JSON.stringify(accessControl), { EX: 3600 });

        res.status(200).json(accessControl);
    } catch (error) {
        next(error);
    }
};

export const updateAccessControl = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const { permissions } = req.body;
        const user = await mysqlDb.User.findByPk(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }
        await accessControlService.updateAccessControl(
            req.user.id,
            userId,
            permissions
        );

        await redisClient.del(`accessControl:${userId}:${req.user.id}`);

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const getGrantedUsersByOwner = async (req, res, next) => {
    try {
        const cacheKey = `grantedUsers:${req.user.id}`;

        const cachedUsers = await redisClient.get(cacheKey);
        if (cachedUsers) {
            return res.status(200).json(JSON.parse(cachedUsers));
        }

        const users = await accessControlService.getGrantedUsersByOwner(req.user.id);
        await redisClient.set(cacheKey, JSON.stringify(users), { EX: 3600 });

        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const deleteAccessControl = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await accessControlService.deleteAccessControl(req.user.id, userId);

        await redisClient.del(`accessControl:${userId}:${req.user.id}`);
        
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
