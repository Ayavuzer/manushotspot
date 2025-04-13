const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const firewallLogController = require('../controllers/firewallLogController');

/**
 * @route GET /api/firewall-logs
 * @desc Get firewall logs with filtering and pagination
 * @access Private - Super Admin or Organization Admin
 */
router.get('/', 
  authenticate, 
  authorize('log_view'), 
  firewallLogController.getFirewallLogs
);

/**
 * @route GET /api/firewall-logs/export
 * @desc Export firewall logs in JSON or CSV format
 * @access Private - Super Admin or Organization Admin
 */
router.get('/export', 
  authenticate, 
  authorize('log_export'), 
  firewallLogController.exportFirewallLogs
);

/**
 * @route POST /api/firewall-logs
 * @desc Add a new firewall log entry
 * @access Private - Typically called by system services, but requires authentication
 */
router.post('/', 
  authenticate, 
  firewallLogController.addFirewallLog
);

module.exports = router;
