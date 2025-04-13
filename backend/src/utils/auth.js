const jwt = require('jsonwebtoken');
const { User, Role, Permission, RolePermission } = require('../models');
require('dotenv').config();

/**
 * Generate JWT token for authenticated user
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      username: user.username,
      email: user.email,
      role_id: user.role_id,
      is_super_admin: user.is_super_admin,
      organization_id: user.organization_id
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * Generate refresh token for authenticated user
 * @param {Object} user - User object
 * @returns {String} Refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Check if user has required permission
 * @param {Number} userId - User ID
 * @param {String} permissionName - Permission name to check
 * @returns {Promise<Boolean>} True if user has permission, false otherwise
 */
const hasPermission = async (userId, permissionName) => {
  try {
    const user = await User.findByPk(userId, {
      include: [{
        model: Role,
        include: [{
          model: Permission,
          where: { name: permissionName }
        }]
      }]
    });

    if (!user) return false;
    
    // Super admin has all permissions
    if (user.is_super_admin) return true;
    
    // Check if role has the permission
    return user.Role && user.Role.Permissions && user.Role.Permissions.length > 0;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  hasPermission
};
