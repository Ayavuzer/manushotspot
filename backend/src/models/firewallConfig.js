const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { encrypt, decrypt } = require('../utils/encryption');

const FirewallConfig = sequelize.define('FirewallConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'organizations',
      key: 'id'
    }
  },
  firewall_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'firewall_types',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  port: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  password_encrypted: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get() {
      const value = this.getDataValue('password_encrypted');
      return value ? decrypt(value) : null;
    },
    set(value) {
      if (value) {
        this.setDataValue('password_encrypted', encrypt(value));
      }
    }
  },
  api_key_encrypted: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get() {
      const value = this.getDataValue('api_key_encrypted');
      return value ? decrypt(value) : null;
    },
    set(value) {
      if (value) {
        this.setDataValue('api_key_encrypted', encrypt(value));
      }
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  connection_status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_connected: {
    type: DataTypes.DATE,
    allowNull: true
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
  tableName: 'firewall_configs',
  timestamps: false
});

module.exports = FirewallConfig;
