const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Log5651 = sequelize.define('Log5651', {
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
  session_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sessions',
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
  destination_ip: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  destination_port: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  protocol: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'logs_5651',
  timestamps: false
});

module.exports = Log5651;
