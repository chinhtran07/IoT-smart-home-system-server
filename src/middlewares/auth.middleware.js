import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer')
      ? authHeader.split(' ')[1]
      : null;

  if (token == null) return next(new Error('Missing token'));
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Error('Forbidden');
    }
    next();
  };
};

export { authenticate, authorize };
