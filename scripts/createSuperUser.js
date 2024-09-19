const bcrypt = require("bcryptjs");
const mysqldb = require('../src/models/mysql');

const createSuperuser = async () => {
  try {
    // Define superuser details
    const superuserDetails = {
      username: 'Admin',
      password: '123456', // This will be hashed
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@example.com',
      phone: '1234567890',
      role: 'admin', // Assigning admin role
    };

    // Check if the superuser already exists
    const existingUser = await mysqldb.User.findOne({
      where: { username: superuserDetails.username }
    });

    if (existingUser) {
      console.log('Superuser already exists');
      return;
    }

    // Create the superuser
    const superuser = await mysqldb.User.create(superuserDetails);
    console.log('Superuser created successfully:', superuser.username);
  } catch (error) {
    console.error('Error creating superuser:', error);
  }
};

// Run the script
createSuperuser();
