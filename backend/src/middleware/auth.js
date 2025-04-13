const { verifyToken, hasPermission } = require('../utils/auth');
const logger = require('../config/logger');

/**
 * Middleware to authenticate JWT token
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user has required permission
 * @param {String} permission - Required permission name
 */
const authorize = (permission) => {
  return async (req, res, next) => {
    try {
      // Super admin bypass permission check
      if (req.user.is_super_admin) {
        return next();
      }

      const hasAccess = await hasPermission(req.user.id, permission);
      
      if (!hasAccess) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
      
      next();
    } catch (error) {
      logger.error('Authorization error:', error);
      return res.status(403).json({ message: 'Authorization failed' });
    }
  };
};

/**
 * Middleware to restrict access to organization data
 * Only allows access to data from user's organization or super admin
 */
const restrictToOrganization = (req, res, next) => {
  try {
    // Super admin can access all organizations
    if (req.user.is_super_admin) {
      return next();
    }

    // Get organization ID from request params or query
    const requestOrgId = parseInt(req.params.organizationId || req.query.organizationId);
    
    // If organization ID is specified in request, check if it matches user's organization
    if (requestOrgId && requestOrgId !== req.user.organization_id) {
      return res.status(403).json({ message: 'Access denied to this organization data' });
    }
    
    // Set organization filter for database queries
    req.organizationFilter = { organization_id: req.user.organization_id };
    
    next();
  } catch (error) {
    logger.error('Organization restriction error:', error);
    return res.status(403).json({ message: 'Organization restriction failed' });
  }
};

module.exports = {
  authenticate,
  authorize,
  restrictToOrganization
};
