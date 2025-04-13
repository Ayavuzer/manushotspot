const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { encrypt, decrypt } = require('../utils/encryption');

const PMSIntegration = sequelize.define('PMSIntegration', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  pms_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  api_url: {
    type: DataTypes.STRING(255),
    allowNull: true
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
  tableName: 'pms_integrations',
  timestamps: false
});

module.exports = PMSIntegration;
