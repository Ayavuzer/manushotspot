const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GuestPackage = sequelize.define('GuestPackage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  guest_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'guests',
      key: 'id'
    }
  },
  package_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'hotspot_packages',
      key: 'id'
    }
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
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
  tableName: 'guest_packages',
  timestamps: false
});

module.exports = GuestPackage;
