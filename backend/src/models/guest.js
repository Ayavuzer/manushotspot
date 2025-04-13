const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guest = sequelize.define('Guest', {
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
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  id_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  room_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  auth_method_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'auth_methods',
      key: 'id'
    }
  },
  auth_reference: {
    type: DataTypes.STRING(255),
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
  tableName: 'guests',
  timestamps: false
});

module.exports = Guest;
