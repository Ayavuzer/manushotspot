const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { encrypt, decrypt } = require('../utils/encryption');

const OrganizationAuthMethod = sequelize.define('OrganizationAuthMethod', {
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
  auth_method_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'auth_methods',
      key: 'id'
    }
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  config: {
    type: DataTypes.JSONB,
    allowNull: true,
    get() {
      const value = this.getDataValue('config');
      if (value) {
        // Decrypt sensitive fields in config
        const config = JSON.parse(JSON.stringify(value));
        if (config.api_key) {
          config.api_key = decrypt(config.api_key);
        }
        if (config.secret) {
          config.secret = decrypt(config.secret);
        }
        if (config.password) {
          config.password = decrypt(config.password);
        }
        return config;
      }
      return null;
    },
    set(value) {
      if (value) {
        // Encrypt sensitive fields in config
        const config = JSON.parse(JSON.stringify(value));
        if (config.api_key) {
          config.api_key = encrypt(config.api_key);
        }
        if (config.secret) {
          config.secret = encrypt(config.secret);
        }
        if (config.password) {
          config.password = encrypt(config.password);
        }
        this.setDataValue('config', config);
      }
    }
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
  tableName: 'organization_auth_methods',
  timestamps: false
});

module.exports = OrganizationAuthMethod;
