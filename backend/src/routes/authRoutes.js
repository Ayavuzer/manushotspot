const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/register', authController.register);

// Protected routes
router.use(authenticate);
router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);
router.put('/password', authController.updatePassword);

module.exports = router;
