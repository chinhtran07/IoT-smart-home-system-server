import config from "../config/index.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";
import redisClient from "../config/redis.config.js";

// Register User Service
export const registerUser = async (username, password, firstName, lastName, email, phone) => {
  try {
    const newUser = new User({ username, password, firstName, lastName, email, phone });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new CustomError(`Failed to register user: ${error.message}`, 400);
  }
};

// Login User Service
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new CustomError("Invalid email or password", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new CustomError("Invalid email or password", 401);

  return await user.generateAuthToken();
};

// Refresh Token Service
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new CustomError("Refresh token is required", 400);
  }

  try {
    // Check if the token has been revoked
    const isRevoked = await redisClient.get(refreshToken);
    if (isRevoked) {
      throw new CustomError("Unauthorized, token has been revoked", 401);
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refresh_secret);
    const user = await User.findById(decoded._id);
    
    if (!user || user.refreshToken !== refreshToken) {
      throw new CustomError("Invalid refresh token or user not found", 403);
    }

    // Revoke the old refresh token by setting it in Redis with an expiration
    await redisClient.set(refreshToken, "revoked", 'EX', config.jwt.refresh_token_expiration);

    // Generate new access and refresh tokens
    return await user.generateAuthToken();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new CustomError("Refresh token expired", 403);
    } else {
      throw new CustomError(`Invalid refresh token: ${error.message}`, 403);
    }
  }
};
