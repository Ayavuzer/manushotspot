const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Create a migration to ensure required permissions exist
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define the permissions we want to ensure exist
    const permissions = [
      // User management permissions
      {
        name: 'user_view',
        description: 'View users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'user_create',
        description: 'Create users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'user_edit',
        description: 'Edit users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'user_delete',
        description: 'Delete users',
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Organization management permissions
      {
        name: 'organization_view',
        description: 'View organizations',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'organization_create',
        description: 'Create organizations',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'organization_edit',
        description: 'Edit organizations',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'organization_delete',
        description: 'Delete organizations',
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Firewall management permissions
      {
        name: 'firewall_view',
        description: 'View firewalls',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'firewall_create',
        description: 'Create firewalls',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'firewall_edit',
        description: 'Edit firewalls',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'firewall_delete',
        description: 'Delete firewalls',
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Log management permissions
      {
        name: 'log_view',
        description: 'View logs',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'log_export',
        description: 'Export logs',
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // User-organization assignment permissions
      {
        name: 'assign_user_to_organization',
        description: 'Assign users to organizations',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Insert permissions if they don't exist
    for (const permission of permissions) {
      await queryInterface.sequelize.query(
        `INSERT INTO permissions (name, description, created_at, updated_at)
         SELECT $1, $2, $3, $4
         WHERE NOT EXISTS (
           SELECT 1 FROM permissions WHERE name = $5
         )`,
        {
          bind: [
            permission.name,
            permission.description,
            permission.created_at,
            permission.updated_at,
            permission.name
          ],
          type: queryInterface.sequelize.QueryTypes.INSERT
        }
      );
    }

    console.log('Permissions created successfully');
    return;
  },

  down: async (queryInterface, Sequelize) => {
    // This is a data migration, so we don't want to remove the permissions in the down migration
    // as they might be referenced by roles
    console.log('This migration cannot be reverted as it would affect existing data');
  }
};
