const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const { authenticate, authorize, restrictToOrganization } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all organizations
router.get('/', restrictToOrganization, organizationController.getAllOrganizations);

// Get organization by ID
router.get('/:id', restrictToOrganization, organizationController.getOrganizationById);

// Create organization (super admin only)
router.post('/', authorize('organization.create'), organizationController.createOrganization);

// Update organization
router.put('/:id', authorize('organization.edit'), restrictToOrganization, organizationController.updateOrganization);

// Delete organization (super admin only)
router.delete('/:id', authorize('organization.delete'), organizationController.deleteOrganization);

module.exports = router;
