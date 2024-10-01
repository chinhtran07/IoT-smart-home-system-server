import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; // Import the Mongoose User model
import CustomError from "../utils/CustomError.js";
import cloudinary from "../config/cloudinary.config.js";
import uploadCloudinary from "../utils/uploadCloudinary.js";

// Get user profile by ID
export const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password -createdAt -updatedAt -refreshToken");
    
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, updateData) => {
  try {
    if (Object.keys(updateData).length === 0) {
      throw new CustomError("Empty updated data", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new CustomError("Updated data is invalid", 400);
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// Change user password
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new CustomError("Password does not match", 400);
    }

    user.password = newPassword; // The password will be hashed by the pre-save hook
    await user.save();

    return true;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    await user.remove();
    return { message: "User deleted successfully" };
  } catch (error) {
    throw error;
  }
};

// Update user avatar
export const updateAvatar = async (userId, file) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const url = await uploadCloudinary(file);
   
    user.avatarURI = url;
    await user.save();

    return uploadResponse;
  } catch (error) {
    throw error;
  }
};
