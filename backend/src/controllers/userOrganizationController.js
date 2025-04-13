const { User, Organization, sequelize } = require('../models');
const logger = require('../config/logger');

/**
 * Controller for managing user-organization assignments
 */

/**
 * Assign a user to an organization
 */
const assignUserToOrganization = async (req, res) => {
  try {
    // Only super admin can assign users to organizations
    if (!req.user.is_super_admin) {
      return res.status(403).json({ message: 'Only super admin can assign users to organizations' });
    }
    
    const { userId, organizationId } = req.body;
    
    if (!userId || !organizationId) {
      return res.status(400).json({ message: 'User ID and Organization ID are required' });
    }
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if organization exists
    const organization = await Organization.findByPk(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Update user's organization
    await user.update({
      organization_id: organizationId,
      updated_at: new Date()
    });
    
    return res.status(200).json({
      message: 'User assigned to organization successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        organization_id: user.organization_id
      }
    });
  } catch (error) {
    logger.error('Assign user to organization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all users in an organization
 */
const getUsersByOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    // For non-super admin users, ensure they can only access their organization
    if (!req.user.is_super_admin && req.user.organization_id !== parseInt(organizationId)) {
      return res.status(403).json({ message: 'Access denied to this organization' });
    }
    
    // Check if organization exists
    const organization = await Organization.findByPk(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Get users in the organization
    const users = await User.findAll({
      where: { organization_id: organizationId },
      attributes: { exclude: ['password_hash'] }
    });
    
    return res.status(200).json({ users });
  } catch (error) {
    logger.error('Get users by organization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Remove a user from an organization
 */
const removeUserFromOrganization = async (req, res) => {
  try {
    // Only super admin can remove users from organizations
    if (!req.user.is_super_admin) {
      return res.status(403).json({ message: 'Only super admin can remove users from organizations' });
    }
    
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user's organization to null
    await user.update({
      organization_id: null,
      updated_at: new Date()
    });
    
    return res.status(200).json({
      message: 'User removed from organization successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        organization_id: user.organization_id
      }
    });
  } catch (error) {
    logger.error('Remove user from organization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  assignUserToOrganization,
  getUsersByOrganization,
  removeUserFromOrganization
};
