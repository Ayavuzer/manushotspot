const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');
const { generateToken, generateRefreshToken } = require('../utils/auth');
const logger = require('../config/logger');
const { redisClient } = require('../config/redis');

/**
 * User login controller
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({
      where: { username, is_active: true },
      include: [{ model: Role }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    await user.update({ last_login: new Date() });

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in Redis
    await redisClient.set(`refresh_token:${user.id}`, refreshToken, {
      EX: 60 * 60 * 24 * 7 // 7 days
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.Role ? user.Role.name : null,
        is_super_admin: user.is_super_admin,
        organization_id: user.organization_id
      },
      token,
      refreshToken
    });
  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Refresh token controller
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = require('jsonwebtoken').verify(refreshToken, process.env.JWT_SECRET);
    
    // Check if refresh token exists in Redis
    const storedToken = await redisClient.get(`refresh_token:${decoded.id}`);
    
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Find user
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role }]
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Generate new tokens
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update refresh token in Redis
    await redisClient.set(`refresh_token:${user.id}`, newRefreshToken, {
      EX: 60 * 60 * 24 * 7 // 7 days
    });

    return res.status(200).json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

/**
 * User logout controller
 */
const logout = async (req, res) => {
  try {
    // Remove refresh token from Redis
    await redisClient.del(`refresh_token:${req.user.id}`);
    
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Register new user controller
 */
const register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, role_id, organization_id } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password_hash: password, // Will be hashed by model hook
      first_name,
      last_name,
      role_id,
      organization_id,
      is_super_admin: false, // Super admin can only be created by another super admin
      is_active: true
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Role }],
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.Role ? user.Role.name : null,
        is_super_admin: user.is_super_admin,
        organization_id: user.organization_id,
        last_login: user.last_login,
        created_at: user.created_at
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update user password
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate current password
    const isPasswordValid = await user.validPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password_hash = newPassword; // Will be hashed by model hook
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    logger.error('Update password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  refreshToken,
  logout,
  register,
  getProfile,
  updatePassword
};
