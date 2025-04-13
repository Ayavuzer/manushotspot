const bcrypt = require('bcryptjs');
const { User, Role, sequelize } = require('../models');
const logger = require('../config/logger');

/**
 * Script to create a superadmin user
 * This script can be run directly from the application
 */
async function createSuperAdmin() {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if the superadmin user already exists
    const existingUser = await User.findOne({
      where: {
        email: 'ali@mrtbt.com'
      },
      transaction
    });

    if (existingUser) {
      console.log('Superadmin user already exists, skipping creation');
      await transaction.commit();
      return { success: true, message: 'Superadmin user already exists', user: existingUser };
    }

    // Find or create the Super Admin role
    let superAdminRole = await Role.findOne({
      where: {
        name: 'Super Admin'
      },
      transaction
    });

    if (!superAdminRole) {
      // Create the Super Admin role if it doesn't exist
      superAdminRole = await Role.create({
        name: 'Super Admin',
        description: 'Full system access with ability to manage all organizations and users',
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction });
      console.log('Super Admin role created successfully');
    }

    // Create the superadmin user
    const passwordHash = await bcrypt.hash('123654Aa', 10);
    
    const superAdmin = await User.create({
      username: 'ali',
      email: 'ali@mrtbt.com',
      password_hash: passwordHash,
      first_name: 'Ali',
      last_name: 'Admin',
      role_id: superAdminRole.id,
      is_super_admin: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction });

    console.log('Superadmin user created successfully');
    
    // Commit the transaction
    await transaction.commit();
    
    return { 
      success: true, 
      message: 'Superadmin user created successfully', 
      user: {
        id: superAdmin.id,
        username: superAdmin.username,
        email: superAdmin.email,
        is_super_admin: superAdmin.is_super_admin
      }
    };
  } catch (error) {
    // If there's an error, rollback the transaction
    await transaction.rollback();
    logger.error('Error creating superadmin user:', error);
    return { success: false, message: 'Error creating superadmin user', error: error.message };
  }
}

module.exports = { createSuperAdmin };
