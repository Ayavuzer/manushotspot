const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const userOrganizationController = require('../controllers/userOrganizationController');

/**
 * @route POST /api/user-organization/assign
 * @desc Assign a user to an organization
 * @access Private - Super Admin only
 */
router.post('/assign', 
  authenticate, 
  authorize('assign_user_to_organization'), 
  userOrganizationController.assignUserToOrganization
);

/**
 * @route GET /api/user-organization/:organizationId/users
 * @desc Get all users in an organization
 * @access Private - Super Admin or Organization Admin
 */
router.get('/:organizationId/users', 
  authenticate, 
  authorize('user_view'), 
  userOrganizationController.getUsersByOrganization
);

/**
 * @route DELETE /api/user-organization/:userId/remove
 * @desc Remove a user from an organization
 * @access Private - Super Admin only
 */
router.delete('/:userId/remove', 
  authenticate, 
  authorize('assign_user_to_organization'), 
  userOrganizationController.removeUserFromOrganization
);

module.exports = router;
