const { Role, Permission, RolePermission, sequelize } = require('../models');
const logger = require('../config/logger');
const { setupPermissions } = require('./setupPermissions');

/**
 * Script to set up role permissions
 * This script assigns the appropriate permissions to each role
 */
async function setupRolePermissions() {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // First ensure all permissions exist
    await setupPermissions();

    // Get all permissions
    const permissions = await Permission.findAll({
      transaction
    });

    // Create a map of permission names to IDs for easier lookup
    const permissionMap = {};
    permissions.forEach(permission => {
      permissionMap[permission.name] = permission.id;
    });

    // Find or create roles
    const superAdminRole = await findOrCreateRole('Super Admin', 'Full system access with ability to manage all organizations and users', transaction);
    const orgAdminRole = await findOrCreateRole('Organization Admin', 'Can manage users, firewalls, and logs within their organization', transaction);
    const userRole = await findOrCreateRole('User', 'Regular user with limited access based on permissions', transaction);

    // Define permission sets for each role
    const superAdminPermissions = Object.values(permissionMap); // All permissions

    const orgAdminPermissions = [
      permissionMap.user_view,
      permissionMap.user_create,
      permissionMap.user_edit,
      permissionMap.user_delete,
      permissionMap.organization_view,
      permissionMap.firewall_view,
      permissionMap.firewall_create,
      permissionMap.firewall_edit,
      permissionMap.firewall_delete,
      permissionMap.log_view,
      permissionMap.log_export
    ];

    const userPermissions = [
      permissionMap.firewall_view,
      permissionMap.log_view
    ];

    // Assign permissions to roles
    await assignPermissionsToRole(superAdminRole.id, superAdminPermissions, transaction);
    await assignPermissionsToRole(orgAdminRole.id, orgAdminPermissions, transaction);
    await assignPermissionsToRole(userRole.id, userPermissions, transaction);

    // Commit the transaction
    await transaction.commit();
    
    return { 
      success: true, 
      message: 'Role permissions set up successfully'
    };
  } catch (error) {
    // If there's an error, rollback the transaction
    await transaction.rollback();
    logger.error('Error setting up role permissions:', error);
    return { success: false, message: 'Error setting up role permissions', error: error.message };
  }
}

/**
 * Helper function to find or create a role
 */
async function findOrCreateRole(name, description, transaction) {
  let role = await Role.findOne({
    where: { name },
    transaction
  });

  if (!role) {
    role = await Role.create({
      name,
      description,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction });
    console.log(`Role ${name} created successfully`);
  }

  return role;
}

/**
 * Helper function to assign permissions to a role
 */
async function assignPermissionsToRole(roleId, permissionIds, transaction) {
  // First, remove any existing permissions for this role
  await RolePermission.destroy({
    where: { role_id: roleId },
    transaction
  });

  // Then, add the new permissions
  const rolePermissions = permissionIds.map(permissionId => ({
    role_id: roleId,
    permission_id: permissionId,
    created_at: new Date()
  }));

  if (rolePermissions.length > 0) {
    await RolePermission.bulkCreate(rolePermissions, { transaction });
  }
}

module.exports = { setupRolePermissions };
