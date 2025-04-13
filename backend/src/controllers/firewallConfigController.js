const { FirewallConfig, FirewallType, Organization } = require('../models');
const logger = require('../config/logger');

/**
 * Get all firewall configurations
 */
const getAllFirewallConfigs = async (req, res) => {
  try {
    // For non-super admin users, filter by their organization
    const where = req.user.is_super_admin ? {} : { organization_id: req.user.organization_id };
    
    const firewallConfigs = await FirewallConfig.findAll({
      where,
      include: [
        { model: FirewallType },
        { model: Organization }
      ]
    });
    
    return res.status(200).json({ firewallConfigs });
  } catch (error) {
    logger.error('Get firewall configs error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get firewall configuration by ID
 */
const getFirewallConfigById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Build query conditions
    const where = { id };
    
    // For non-super admin users, ensure they can only access firewalls in their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    const firewallConfig = await FirewallConfig.findOne({
      where,
      include: [
        { model: FirewallType },
        { model: Organization }
      ]
    });
    
    if (!firewallConfig) {
      return res.status(404).json({ message: 'Firewall configuration not found' });
    }
    
    return res.status(200).json({ firewallConfig });
  } catch (error) {
    logger.error('Get firewall config error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new firewall configuration
 */
const createFirewallConfig = async (req, res) => {
  try {
    const { 
      organization_id, 
      firewall_type_id, 
      name, 
      ip_address, 
      port, 
      username, 
      password, 
      api_key 
    } = req.body;
    
    // For non-super admin users, ensure they can only create firewalls in their organization
    if (!req.user.is_super_admin && req.user.organization_id !== parseInt(organization_id)) {
      return res.status(403).json({ message: 'You can only create firewalls in your organization' });
    }
    
    // Create new firewall config
    const firewallConfig = await FirewallConfig.create({
      organization_id: req.user.is_super_admin ? organization_id : req.user.organization_id,
      firewall_type_id,
      name,
      ip_address,
      port,
      username,
      password_encrypted: password,
      api_key_encrypted: api_key,
      is_active: true,
      connection_status: 'Pending',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return res.status(201).json({
      message: 'Firewall configuration created successfully',
      firewallConfig: {
        id: firewallConfig.id,
        organization_id: firewallConfig.organization_id,
        firewall_type_id: firewallConfig.firewall_type_id,
        name: firewallConfig.name,
        ip_address: firewallConfig.ip_address,
        port: firewallConfig.port,
        username: firewallConfig.username,
        is_active: firewallConfig.is_active,
        connection_status: firewallConfig.connection_status
      }
    });
  } catch (error) {
    logger.error('Create firewall config error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update firewall configuration
 */
const updateFirewallConfig = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Build query conditions
    const where = { id };
    
    // For non-super admin users, ensure they can only update firewalls in their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    const firewallConfig = await FirewallConfig.findOne({ where });
    
    if (!firewallConfig) {
      return res.status(404).json({ message: 'Firewall configuration not found' });
    }
    
    const { 
      organization_id, 
      firewall_type_id, 
      name, 
      ip_address, 
      port, 
      username, 
      password, 
      api_key,
      is_active 
    } = req.body;
    
    // For non-super admin users, ensure they cannot change the organization
    if (organization_id && !req.user.is_super_admin && parseInt(organization_id) !== req.user.organization_id) {
      return res.status(403).json({ message: 'You cannot change the organization of a firewall' });
    }
    
    // Update firewall config
    await firewallConfig.update({
      organization_id: req.user.is_super_admin && organization_id ? organization_id : firewallConfig.organization_id,
      firewall_type_id: firewall_type_id || firewallConfig.firewall_type_id,
      name: name || firewallConfig.name,
      ip_address: ip_address || firewallConfig.ip_address,
      port: port !== undefined ? port : firewallConfig.port,
      username: username !== undefined ? username : firewallConfig.username,
      password_encrypted: password !== undefined ? password : undefined,
      api_key_encrypted: api_key !== undefined ? api_key : undefined,
      is_active: is_active !== undefined ? is_active : firewallConfig.is_active,
      updated_at: new Date()
    });
    
    return res.status(200).json({
      message: 'Firewall configuration updated successfully',
      firewallConfig: {
        id: firewallConfig.id,
        organization_id: firewallConfig.organization_id,
        firewall_type_id: firewallConfig.firewall_type_id,
        name: firewallConfig.name,
        ip_address: firewallConfig.ip_address,
        port: firewallConfig.port,
        username: firewallConfig.username,
        is_active: firewallConfig.is_active,
        connection_status: firewallConfig.connection_status
      }
    });
  } catch (error) {
    logger.error('Update firewall config error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete firewall configuration
 */
const deleteFirewallConfig = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Build query conditions
    const where = { id };
    
    // For non-super admin users, ensure they can only delete firewalls in their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    const firewallConfig = await FirewallConfig.findOne({ where });
    
    if (!firewallConfig) {
      return res.status(404).json({ message: 'Firewall configuration not found' });
    }
    
    // Soft delete by setting is_active to false
    await firewallConfig.update({
      is_active: false,
      updated_at: new Date()
    });
    
    return res.status(200).json({
      message: 'Firewall configuration deleted successfully'
    });
  } catch (error) {
    logger.error('Delete firewall config error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllFirewallConfigs,
  getFirewallConfigById,
  createFirewallConfig,
  updateFirewallConfig,
  deleteFirewallConfig
};
