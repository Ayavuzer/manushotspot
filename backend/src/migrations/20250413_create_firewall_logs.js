const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Create a migration to add firewall_logs table
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('firewall_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firewall_config_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'firewall_configs',
          key: 'id'
        }
      },
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id'
        }
      },
      log_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      source_ip: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      destination_ip: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      source_port: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      destination_port: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      protocol: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('firewall_logs', ['firewall_config_id']);
    await queryInterface.addIndex('firewall_logs', ['organization_id']);
    await queryInterface.addIndex('firewall_logs', ['timestamp']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('firewall_logs');
  }
};
