const express = require('express');
const router = express.Router();
const { createSuperAdmin } = require('../scripts/createSuperAdmin');
const { setupRolePermissions } = require('../scripts/setupRolePermissions');

/**
 * @route POST /api/admin/setup
 * @desc Create superadmin user if it doesn't exist
 * @access Public (should be restricted in production)
 */
router.post('/setup', async (req, res) => {
  try {
    // First create the superadmin user
    const userResult = await createSuperAdmin();
    
    // Then set up role permissions
    const permissionsResult = await setupRolePermissions();
    
    return res.status(200).json({
      success: userResult.success && permissionsResult.success,
      message: 'System setup completed',
      user: userResult,
      permissions: permissionsResult
    });
  } catch (error) {
    console.error('Error in setup route:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
