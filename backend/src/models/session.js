const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
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
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'organizations',
      key: 'id'
    }
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  mac_address: {
    type: DataTypes.STRING(17),
    allowNull: false
  },
  device_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  browser: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  os: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  data_usage_bytes: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING(50),
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
  tableName: 'sessions',
  timestamps: false
});

module.exports = Session;
