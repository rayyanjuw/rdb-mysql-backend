const sequelize = require('../config/mysqlConnection');
const User = require('../Models/userModels');
const bcrypt = require('bcryptjs');

// Create an admin user
const createAdminUser = async () => {
    try {
      // Synchronize the model with the database
      await sequelize.sync();
  
      // Check if the admin user already exists
      const adminUser = await User.findOne({ where: { username: 'admin' } });
      if (adminUser) {
        console.log('Admin user already exists.');
        return;
      }


      const hashedPassword = await bcrypt.hash('adminpassword', 10);
  
      // Create the admin user
      await User.create({
        name: 'Admin',
        username: 'admin',
        password: hashedPassword, // You should hash this in production
        role: 'admin',
        email: 'admin@example.com',
      });
  
      console.log('Admin user created successfully.');
    } catch (error) {
      console.error('Error creating admin user:', error);
    } finally {
      // Close the database connection
      await sequelize.close();
    }
  };
  
  createAdminUser();

 