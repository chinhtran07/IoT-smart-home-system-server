import mongoose from "mongoose";
import User from "../src/models/user.model.js"; // Update the path to your MongoDB user model
import dotenv from 'dotenv';

dotenv.config();

const createSuperuser = async () => {
  try {
    // Connect to the database
    await mongoose.connect("mongodb://localhost:27017/smart-home");

    // Define superuser details
    const superuserDetails = {
      username: 'Admin',
      password: '123456', // Make sure to hash the password in a real application
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@example.com',
      phone: '1234567890',
      role: 'admin',
    };

    // Check if the superuser already exists
    const existingUser = await User.findOne({ username: superuserDetails.username });

    if (existingUser) {
      console.log('Superuser already exists');
      return;
    }

    // Create the superuser
    const superuser = new User(superuserDetails);
    await superuser.save(); // Save the user to the database
    console.log('Superuser created successfully:', superuser.username);
    return;
  } catch (error) {
    console.error('Error creating superuser:', error);
  }
};

// Run the script
await createSuperuser();
