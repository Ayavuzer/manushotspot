const { FirewallType, FirewallConfig, Organization } = require('../models');
const logger = require('../config/logger');
const { encrypt } = require('../utils/encryption');
const { publishMessage } = require('../config/rabbitmq');

/**
 * Get all firewall types
 */
const getAllFirewallTypes = async (req, res) => {
  try {
    const firewallTypes = await FirewallType.findAll();
    return res.status(200).json({ firewallTypes });
  } catch (error) {
    logger.error('Get firewall types error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

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
        { model: Organization },
        { model: FirewallType }
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
    
    // For non-super admin users, ensure they can only access configs in their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    const firewallConfig = await FirewallConfig.findOne({
      where,
      include: [
        { model: Organization },
        { model: FirewallType }
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
    
    // For non-super admin users, ensure they can only create configs in their organization
    if (!req.user.is_super_admin && req.user.organization_id !== parseInt(organization_id)) {
      return res.status(403).json({ message: 'You can only create configurations for your organization' });
    }
    
    // Create new firewall config
    const firewallConfig = await FirewallConfig.create({
      organization_id,
      firewall_type_id,
      name,
      ip_address,
      port,
      username,
      password_encrypted: password,
      api_key_encrypted: api_key,
      is_active: true,
      connection_status: 'Pending',
      last_connected: null
    });
    
    // Send message to test connection
    await publishMessage('firewall_commands', {
      action: 'test_connection',
      firewall_config_id: firewallConfig.id
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
    
    // For non-super admin users, ensure they can only update configs in their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    const firewallConfig = await FirewallConfig.findOne({ where });
    
    if (!firewallConfig) {
      return res.status(404).json({ message: 'Firewall configuration not found' });
    }
    
    const {
      name,
      ip_address,
      port,
      username,
      password,
      api_key,
      is_active
    } = req.body;
    
    // Update firewall config
    const updateData = {
      name: name || firewallConfig.name,
      ip_address: ip_address || firewallConfig.ip_address,
      port: port !== undefined ? port : firewallConfig.port,
      username: username !== undefined ? username : firewallConfig.username,
      is_active: is_active !== undefined ? is_active : firewallConfig.is_active,
      updated_at: new Date()
    };
    
    // Only update password if provided
    if (password) {
      updateData.password_encrypted = password;
    }
    
    // Only update API key if provided
    if (api_key) {
      updateData.api_key_encrypted = api_key;
    }
    
    await firewallConfig.update(updateData);
    
    // Send message to test connection if active
    if (firewallConfig.is_active) {
      await publishMessage('firewall_commands', {
        action: 'test_connection',
        firewall_config_id: firewallConfig.id
      });
    }
    
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
    
    // For non-super admin users, ensure they can only delete configs in their organization
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

/**
 * Test firewall connection
 */
const testFirewallConnection = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Build query conditions
    const where = { id };
    
    // For non-super admin users, ensure they can only test configs in their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    const firewallConfig = await FirewallConfig.findOne({ where });
    
    if (!firewallConfig) {
      return res.status(404).json({ message: 'Firewall configuration not found' });
    }
    
    // Send message to test connection
    await publishMessage('firewall_commands', {
      action: 'test_connection',
      firewall_config_id: firewallConfig.id
    });
    
    return res.status(200).json({
      message: 'Connection test initiated',
      status: 'pending'
    });
  } catch (error) {
    logger.error('Test firewall connection error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllFirewallTypes,
  getAllFirewallConfigs,
  getFirewallConfigById,
  createFirewallConfig,
  updateFirewallConfig,
  deleteFirewallConfig,
  testFirewallConnection
};
