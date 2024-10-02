import config from "../config/index.js";
import User from "../models/user.model.js"; 
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";

// Register User Service
export const registerUser = async (
  username,
  password,
  firstName,
  lastName,
  email,
  phone
) => {
  try {
    const newUser = new User({
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    throw new CustomError(error.message, 400);
  }
};

// Login User Service
export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError("Invalid username or password", 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new CustomError("Invalid username or password", 401);

    const tokens = await user.generateAuthToken();
    return tokens;
  } catch (error) {
    throw new CustomError(`Error logging in user: ${error.message}`, 500);
  }
};

// Refresh Token Service
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new CustomError("Refresh token is required", 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refresh_secret);
    const user = await User.findById(decoded._id);
    
    if (!user || user.refreshToken !== refreshToken) {
      throw new CustomError("User not found or invalid refresh token", 403);
    }

    const newTokens = await user.generateAuthToken();
    return newTokens;
  } catch (error) {
    throw new CustomError("Invalid refresh token", 403);
  }
};
