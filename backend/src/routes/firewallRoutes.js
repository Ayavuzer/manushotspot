const express = require('express');
const router = express.Router();
const firewallController = require('../controllers/firewallController');
const { authenticate, authorize, restrictToOrganization } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all firewall types
router.get('/types', authorize('firewall.view'), firewallController.getAllFirewallTypes);

// Get all firewall configurations
router.get('/', restrictToOrganization, authorize('firewall.view'), firewallController.getAllFirewallConfigs);

// Get firewall configuration by ID
router.get('/:id', restrictToOrganization, authorize('firewall.view'), firewallController.getFirewallConfigById);

// Create firewall configuration
router.post('/', restrictToOrganization, authorize('firewall.create'), firewallController.createFirewallConfig);

// Update firewall configuration
router.put('/:id', restrictToOrganization, authorize('firewall.edit'), firewallController.updateFirewallConfig);

// Delete firewall configuration
router.delete('/:id', restrictToOrganization, authorize('firewall.delete'), firewallController.deleteFirewallConfig);

// Test firewall connection
router.post('/:id/test-connection', restrictToOrganization, authorize('firewall.edit'), firewallController.testFirewallConnection);

module.exports = router;
