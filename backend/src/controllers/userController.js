const { User, Role, Organization } = require('../models');
const logger = require('../config/logger');
const { Op } = require('sequelize');

/**
 * Get all users
 */
const getAllUsers = async (req, res) => {
  try {
    // For non-super admin users, filter by their organization
    const where = req.user.is_super_admin ? {} : { organization_id: req.user.organization_id };
    
    const users = await User.findAll({
      where,
      include: [{ model: Role }, { model: Organization }],
      attributes: { exclude: ['password_hash'] }
    });
    
    return res.status(200).json({ users });
  } catch (error) {
    logger.error('Get users error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Build query conditions
    const where = { id };
    
    // For non-super admin users, ensure they can only access users in their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    const user = await User.findOne({
      where,
      include: [{ model: Role }, { model: Organization }],
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    logger.error('Get user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new user
 */
const createUser = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      first_name, 
      last_name, 
      phone, 
      role_id, 
      organization_id, 
      is_super_admin 
    } = req.body;
    
    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    // Only super admin can create super admin users
    if (is_super_admin && !req.user.is_super_admin) {
      return res.status(403).json({ message: 'Only super admin can create super admin users' });
    }
    
    // For non-super admin users, ensure they can only create users in their organization
    if (!req.user.is_super_admin && req.user.organization_id !== organization_id) {
      return res.status(403).json({ message: 'You can only create users in your organization' });
    }
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password_hash: password, // Will be hashed by model hook
      first_name,
      last_name,
      phone,
      role_id,
      organization_id,
      is_super_admin: is_super_admin || false,
      is_active: true
    });
    
    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role_id: user.role_id,
        organization_id: user.organization_id,
        is_super_admin: user.is_super_admin,
        is_active: user.is_active
      }
    });
  } catch (error) {
    logger.error('Create user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update user
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Build query conditions
    const where = { id };
    
    // For non-super admin users, ensure they can only update users in their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    const user = await User.findOne({ where });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { 
      email, 
      first_name, 
      last_name, 
      phone, 
      role_id, 
      organization_id, 
      is_super_admin,
      is_active 
    } = req.body;
    
    // Only super admin can update super admin status
    if (is_super_admin !== undefined && !req.user.is_super_admin) {
      return res.status(403).json({ message: 'Only super admin can update super admin status' });
    }
    
    // Only super admin can change organization
    if (organization_id !== undefined && organization_id !== user.organization_id && !req.user.is_super_admin) {
      return res.status(403).json({ message: 'Only super admin can change user organization' });
    }
    
    // Update user
    await user.update({
      email: email || user.email,
      first_name: first_name !== undefined ? first_name : user.first_name,
      last_name: last_name !== undefined ? last_name : user.last_name,
      phone: phone !== undefined ? phone : user.phone,
      role_id: role_id !== undefined ? role_id : user.role_id,
      organization_id: organization_id !== undefined ? organization_id : user.organization_id,
      is_super_admin: is_super_admin !== undefined ? is_super_admin : user.is_super_admin,
      is_active: is_active !== undefined ? is_active : user.is_active,
      updated_at: new Date()
    });
    
    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role_id: user.role_id,
        organization_id: user.organization_id,
        is_super_admin: user.is_super_admin,
        is_active: user.is_active
      }
    });
  } catch (error) {
    logger.error('Update user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Build query conditions
    const where = { id };
    
    // For non-super admin users, ensure they can only delete users in their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    const user = await User.findOne({ where });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Cannot delete yourself
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Cannot delete super admin unless you are super admin
    if (user.is_super_admin && !req.user.is_super_admin) {
      return res.status(403).json({ message: 'Only super admin can delete super admin users' });
    }
    
    // Soft delete by setting is_active to false
    await user.update({
      is_active: false,
      updated_at: new Date()
    });
    
    return res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
