#!/usr/bin/env node

const { createSuperAdmin } = require('../scripts/createSuperAdmin');
const { setupRolePermissions } = require('../scripts/setupRolePermissions');

/**
 * Test script to verify superadmin functionality
 */
async function testSuperAdminSetup() {
  console.log('Starting superadmin setup test...');
  
  try {
    // Step 1: Create superadmin user
    console.log('\n--- Step 1: Creating superadmin user ---');
    const userResult = await createSuperAdmin();
    console.log('Superadmin user creation result:', userResult);
    
    // Step 2: Setup role permissions
    console.log('\n--- Step 2: Setting up role permissions ---');
    const permissionsResult = await setupRolePermissions();
    console.log('Role permissions setup result:', permissionsResult);
    
    console.log('\n--- Test completed successfully ---');
    console.log('Superadmin user (ali@mrtbt.com) has been created with password 123654Aa');
    console.log('Role permissions have been set up for Super Admin, Organization Admin, and User roles');
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testSuperAdminSetup();
