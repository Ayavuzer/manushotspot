const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize, restrictToOrganization } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all users
router.get('/', restrictToOrganization, authorize('user.view'), userController.getAllUsers);

// Get user by ID
router.get('/:id', restrictToOrganization, authorize('user.view'), userController.getUserById);

// Create user
router.post('/', restrictToOrganization, authorize('user.create'), userController.createUser);

// Update user
router.put('/:id', restrictToOrganization, authorize('user.edit'), userController.updateUser);

// Delete user
router.delete('/:id', restrictToOrganization, authorize('user.delete'), userController.deleteUser);

module.exports = router;
