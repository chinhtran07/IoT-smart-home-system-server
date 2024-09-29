import mysqldb from "../src/models/mysql/index.js"

const createSuperuser = async () => {
  try {
    // Define superuser details
    const superuserDetails = {
      username: 'Admin',
      password: '123456',
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@example.com',
      phone: '1234567890',
      role: 'admin', 
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
