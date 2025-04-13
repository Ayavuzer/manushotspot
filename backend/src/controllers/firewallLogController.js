const { FirewallLog, FirewallConfig, Organization } = require('../models');
const logger = require('../config/logger');

/**
 * Get firewall logs
 */
const getFirewallLogs = async (req, res) => {
  try {
    const { 
      firewall_config_id, 
      start_date, 
      end_date, 
      log_type,
      limit = 100,
      offset = 0
    } = req.query;
    
    // Build query conditions
    const where = {};
    
    // For non-super admin users, filter by their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    // Add firewall config filter if provided
    if (firewall_config_id) {
      // If non-super admin, verify the firewall belongs to their organization
      if (!req.user.is_super_admin) {
        const firewallConfig = await FirewallConfig.findOne({
          where: { 
            id: firewall_config_id,
            organization_id: req.user.organization_id
          }
        });
        
        if (!firewallConfig) {
          return res.status(403).json({ message: 'Access denied to this firewall' });
        }
      }
      
      where.firewall_config_id = firewall_config_id;
    }
    
    // Add date range filter if provided
    if (start_date && end_date) {
      where.timestamp = {
        [require('sequelize').Op.between]: [new Date(start_date), new Date(end_date)]
      };
    } else if (start_date) {
      where.timestamp = {
        [require('sequelize').Op.gte]: new Date(start_date)
      };
    } else if (end_date) {
      where.timestamp = {
        [require('sequelize').Op.lte]: new Date(end_date)
      };
    }
    
    // Add log type filter if provided
    if (log_type) {
      where.log_type = log_type;
    }
    
    // Get logs with pagination
    const { count, rows: logs } = await FirewallLog.findAndCountAll({
      where,
      include: [
        { model: FirewallConfig },
        { model: Organization }
      ],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.status(200).json({ 
      logs,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('Get firewall logs error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Export firewall logs
 */
const exportFirewallLogs = async (req, res) => {
  try {
    const { 
      firewall_config_id, 
      start_date, 
      end_date, 
      log_type,
      format = 'json' // 'json' or 'csv'
    } = req.query;
    
    // Build query conditions
    const where = {};
    
    // For non-super admin users, filter by their organization
    if (!req.user.is_super_admin) {
      where.organization_id = req.user.organization_id;
    }
    
    // Add firewall config filter if provided
    if (firewall_config_id) {
      // If non-super admin, verify the firewall belongs to their organization
      if (!req.user.is_super_admin) {
        const firewallConfig = await FirewallConfig.findOne({
          where: { 
            id: firewall_config_id,
            organization_id: req.user.organization_id
          }
        });
        
        if (!firewallConfig) {
          return res.status(403).json({ message: 'Access denied to this firewall' });
        }
      }
      
      where.firewall_config_id = firewall_config_id;
    }
    
    // Add date range filter if provided
    if (start_date && end_date) {
      where.timestamp = {
        [require('sequelize').Op.between]: [new Date(start_date), new Date(end_date)]
      };
    } else if (start_date) {
      where.timestamp = {
        [require('sequelize').Op.gte]: new Date(start_date)
      };
    } else if (end_date) {
      where.timestamp = {
        [require('sequelize').Op.lte]: new Date(end_date)
      };
    }
    
    // Add log type filter if provided
    if (log_type) {
      where.log_type = log_type;
    }
    
    // Get logs
    const logs = await FirewallLog.findAll({
      where,
      include: [
        { model: FirewallConfig },
        { model: Organization }
      ],
      order: [['timestamp', 'DESC']]
    });
    
    // Format logs based on requested format
    if (format.toLowerCase() === 'csv') {
      // Create CSV content
      const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
      const csvStringifier = createCsvStringifier({
        header: [
          { id: 'id', title: 'ID' },
          { id: 'firewall_name', title: 'Firewall Name' },
          { id: 'organization_name', title: 'Organization' },
          { id: 'log_type', title: 'Log Type' },
          { id: 'source_ip', title: 'Source IP' },
          { id: 'destination_ip', title: 'Destination IP' },
          { id: 'source_port', title: 'Source Port' },
          { id: 'destination_port', title: 'Destination Port' },
          { id: 'protocol', title: 'Protocol' },
          { id: 'action', title: 'Action' },
          { id: 'message', title: 'Message' },
          { id: 'timestamp', title: 'Timestamp' }
        ]
      });
      
      const records = logs.map(log => ({
        id: log.id,
        firewall_name: log.FirewallConfig ? log.FirewallConfig.name : '',
        organization_name: log.Organization ? log.Organization.name : '',
        log_type: log.log_type,
        source_ip: log.source_ip || '',
        destination_ip: log.destination_ip || '',
        source_port: log.source_port || '',
        destination_port: log.destination_port || '',
        protocol: log.protocol || '',
        action: log.action || '',
        message: log.message || '',
        timestamp: log.timestamp ? log.timestamp.toISOString() : ''
      }));
      
      const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="firewall_logs.csv"');
      return res.send(csvContent);
    } else {
      // Default to JSON format
      return res.status(200).json({ logs });
    }
  } catch (error) {
    logger.error('Export firewall logs error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Add a firewall log entry (typically called by firewall integration services)
 */
const addFirewallLog = async (req, res) => {
  try {
    const { 
      firewall_config_id, 
      log_type, 
      source_ip, 
      destination_ip, 
      source_port, 
      destination_port, 
      protocol, 
      action, 
      message, 
      timestamp 
    } = req.body;
    
    // Validate required fields
    if (!firewall_config_id || !log_type) {
      return res.status(400).json({ message: 'Firewall config ID and log type are required' });
    }
    
    // Get the firewall config to verify it exists and get organization_id
    const firewallConfig = await FirewallConfig.findByPk(firewall_config_id);
    
    if (!firewallConfig) {
      return res.status(404).json({ message: 'Firewall configuration not found' });
    }
    
    // Create the log entry
    const log = await FirewallLog.create({
      firewall_config_id,
      organization_id: firewallConfig.organization_id,
      log_type,
      source_ip,
      destination_ip,
      source_port,
      destination_port,
      protocol,
      action,
      message,
      timestamp: timestamp || new Date(),
      created_at: new Date()
    });
    
    return res.status(201).json({
      message: 'Firewall log entry created successfully',
      log
    });
  } catch (error) {
    logger.error('Add firewall log error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getFirewallLogs,
  exportFirewallLogs,
  addFirewallLog
};
