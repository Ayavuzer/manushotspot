const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const firewallConfigController = require('../controllers/firewallConfigController');

/**
 * @route GET /api/firewall-configs
 * @desc Get all firewall configurations
 * @access Private - Super Admin or Organization Admin
 */
router.get('/', 
  authenticate, 
  authorize('firewall_view'), 
  firewallConfigController.getAllFirewallConfigs
);

/**
 * @route GET /api/firewall-configs/:id
 * @desc Get firewall configuration by ID
 * @access Private - Super Admin or Organization Admin
 */
router.get('/:id', 
  authenticate, 
  authorize('firewall_view'), 
  firewallConfigController.getFirewallConfigById
);

/**
 * @route POST /api/firewall-configs
 * @desc Create new firewall configuration
 * @access Private - Super Admin or Organization Admin
 */
router.post('/', 
  authenticate, 
  authorize('firewall_create'), 
  firewallConfigController.createFirewallConfig
);

/**
 * @route PUT /api/firewall-configs/:id
 * @desc Update firewall configuration
 * @access Private - Super Admin or Organization Admin
 */
router.put('/:id', 
  authenticate, 
  authorize('firewall_edit'), 
  firewallConfigController.updateFirewallConfig
);

/**
 * @route DELETE /api/firewall-configs/:id
 * @desc Delete firewall configuration
 * @access Private - Super Admin or Organization Admin
 */
router.delete('/:id', 
  authenticate, 
  authorize('firewall_delete'), 
  firewallConfigController.deleteFirewallConfig
);

module.exports = router;
