const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FirewallLog = sequelize.define('FirewallLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firewall_config_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'firewall_configs',
      key: 'id'
    }
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'organizations',
      key: 'id'
    }
  },
  log_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  source_ip: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  destination_ip: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  source_port: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  destination_port: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  protocol: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'firewall_logs',
  timestamps: false
});

module.exports = FirewallLog;
