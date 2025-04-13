const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HotspotPackage = sequelize.define('HotspotPackage', {
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
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  data_limit_bytes: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  bandwidth_limit_kbps: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'hotspot_packages',
  timestamps: false
});

module.exports = HotspotPackage;
