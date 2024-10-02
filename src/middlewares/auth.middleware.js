import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/user.model.js';
import CustomError from '../utils/CustomError.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer')
      ? authHeader.split(' ')[1]
      : null;

  if (!token) return res.status(401).json({message: "missing token"});

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).json({message: "User not found"});

    req.user = user; 
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
