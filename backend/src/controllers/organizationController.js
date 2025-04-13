const { Organization } = require('../models');
const logger = require('../config/logger');

/**
 * Get all organizations
 */
const getAllOrganizations = async (req, res) => {
  try {
    // For non-super admin users, filter by their organization
    const where = req.user.is_super_admin ? {} : { id: req.user.organization_id };
    
    const organizations = await Organization.findAll({ where });
    
    return res.status(200).json({ organizations });
  } catch (error) {
    logger.error('Get organizations error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get organization by ID
 */
const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // For non-super admin users, ensure they can only access their organization
    if (!req.user.is_super_admin && req.user.organization_id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied to this organization' });
    }
    
    const organization = await Organization.findByPk(id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    return res.status(200).json({ organization });
  } catch (error) {
    logger.error('Get organization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new organization
 */
const createOrganization = async (req, res) => {
  try {
    // Only super admin can create organizations
    if (!req.user.is_super_admin) {
      return res.status(403).json({ message: 'Only super admin can create organizations' });
    }
    
    const { name, description, address, phone, email, logo_url } = req.body;
    
    const organization = await Organization.create({
      name,
      description,
      address,
      phone,
      email,
      logo_url,
      is_active: true
    });
    
    return res.status(201).json({
      message: 'Organization created successfully',
      organization
    });
  } catch (error) {
    logger.error('Create organization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update organization
 */
const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    
    // For non-super admin users, ensure they can only update their organization
    if (!req.user.is_super_admin && req.user.organization_id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied to this organization' });
    }
    
    const organization = await Organization.findByPk(id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    const { name, description, address, phone, email, logo_url, is_active } = req.body;
    
    // Update organization
    await organization.update({
      name: name || organization.name,
      description: description !== undefined ? description : organization.description,
      address: address !== undefined ? address : organization.address,
      phone: phone !== undefined ? phone : organization.phone,
      email: email !== undefined ? email : organization.email,
      logo_url: logo_url !== undefined ? logo_url : organization.logo_url,
      is_active: is_active !== undefined ? is_active : organization.is_active,
      updated_at: new Date()
    });
    
    return res.status(200).json({
      message: 'Organization updated successfully',
      organization
    });
  } catch (error) {
    logger.error('Update organization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete organization
 */
const deleteOrganization = async (req, res) => {
  try {
    // Only super admin can delete organizations
    if (!req.user.is_super_admin) {
      return res.status(403).json({ message: 'Only super admin can delete organizations' });
    }
    
    const { id } = req.params;
    
    const organization = await Organization.findByPk(id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Soft delete by setting is_active to false
    await organization.update({
      is_active: false,
      updated_at: new Date()
    });
    
    return res.status(200).json({
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    logger.error('Delete organization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization
};
