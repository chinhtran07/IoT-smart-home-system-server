import cloudinary from "../config/cloudinary.config.js"; // Ensure correct import path
import CustomError from "../utils/CustomError.js"; // Import your custom error class

const uploadCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' }, // Ensure resource type is specified
      (error, result) => {
        if (result) {
          resolve(result.secure_url); // Use secure_url returned by Cloudinary
        } else {
          reject(new CustomError("Failed to upload image to Cloudinary", 500));
        }
      }
    );

    // Pipe the file buffer into the Cloudinary upload stream
    stream.end(file.buffer);
  });
};

export default uploadCloudinary;
