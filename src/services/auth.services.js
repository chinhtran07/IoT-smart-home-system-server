import config from "../config/index.js";
import db from "../models/mysql/index.js";
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";

export const registerUser = async (
  username,
  password,
  firstName,
  lastName,
  email,
  phone
) => {
  try {
    const newUser = await db.User.create({
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await db.User.findOne({ where: { email: email } });
    if (!user) throw new Error("Invalid username or password");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid username or password");

    const tokens = user.generateAuthToken();

    return tokens;
  } catch (error) {
    throw new Error(`Error logging in user: ${error.message}`);
  }
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new CustomError("Refresh token is required", 400);
  }

  const decoded = jwt.verify(refreshToken, config.jwt.refresh_secret);
  if (!decoded) {
    throw new CustomError("Invalid refresh token", 403);
  }

  const user = await db.User.findByPk(decoded._id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new CustomError("User not found or invalid refresh token", 403);
  }

  const newTokens = await user.generateAuthToken();

  return newTokens;
};
