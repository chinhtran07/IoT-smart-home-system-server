import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import redisClient from "../config/redis.config.js";
import CustomError from '../utils/CustomError.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer')
      ? authHeader.split(' ')[1]
      : null;

  if (!token) return res.status(401).json({message: "missing token"});

  try {

    const isRevoked = await redisClient.get(token);
    if (!isRevoked) {
        return next(new CustomError("Unauthorized, token has been revoked", 401));
    }
    
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; 
    next();
  } catch (error) {
    return next(error);
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};

export { authenticate, authorize };
