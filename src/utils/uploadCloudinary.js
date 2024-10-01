import cloudinary from "../config/cloudinary.config.js"; // Ensure correct import path
import CustomError from "../utils/CustomError.js"; // Import your custom error class

const uploadCloudinary = async (file) => {
  try {
    const uploadResponse = cloudinary.uploader.upload_stream();

    // Return a Promise that resolves when the upload finishes
    return await new Promise((resolve, reject) => {
      // Pipe the file stream to Cloudinary's upload stream
      file.stream.pipe(uploadResponse);

      // Handle the upload response
      uploadResponse.on("finish", () => resolve(uploadResponse.url));
      uploadResponse.on("error", (error) => {
        reject(new CustomError("Failed to upload image to Cloudinary", 500));
      });
    });
  } catch (error) {
    throw new CustomError("Failed to upload image to Cloudinary", 500);
  }
};

export default uploadCloudinary;
