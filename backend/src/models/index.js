const sequelize = require('../config/database');
const Organization = require('./organization');
const Role = require('./role');
const User = require('./user');
const Permission = require('./permission');
const RolePermission = require('./rolePermission');
const FirewallType = require('./firewallType');
const FirewallConfig = require('./firewallConfig');
const AuthMethod = require('./authMethod');
const OrganizationAuthMethod = require('./organizationAuthMethod');
const PMSIntegration = require('./pmsIntegration');
const Guest = require('./guest');
const Session = require('./session');
const Log5651 = require('./log5651');
const HotspotPackage = require('./hotspotPackage');
const GuestPackage = require('./guestPackage');

// Define associations
Organization.hasMany(User, { foreignKey: 'organization_id' });
User.belongsTo(Organization, { foreignKey: 'organization_id' });

Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', otherKey: 'permission_id' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id', otherKey: 'role_id' });

Organization.hasMany(FirewallConfig, { foreignKey: 'organization_id' });
FirewallConfig.belongsTo(Organization, { foreignKey: 'organization_id' });

FirewallType.hasMany(FirewallConfig, { foreignKey: 'firewall_type_id' });
FirewallConfig.belongsTo(FirewallType, { foreignKey: 'firewall_type_id' });

Organization.hasMany(OrganizationAuthMethod, { foreignKey: 'organization_id' });
OrganizationAuthMethod.belongsTo(Organization, { foreignKey: 'organization_id' });

AuthMethod.hasMany(OrganizationAuthMethod, { foreignKey: 'auth_method_id' });
OrganizationAuthMethod.belongsTo(AuthMethod, { foreignKey: 'auth_method_id' });

Organization.hasMany(PMSIntegration, { foreignKey: 'organization_id' });
PMSIntegration.belongsTo(Organization, { foreignKey: 'organization_id' });

Organization.hasMany(Guest, { foreignKey: 'organization_id' });
Guest.belongsTo(Organization, { foreignKey: 'organization_id' });

AuthMethod.hasMany(Guest, { foreignKey: 'auth_method_id' });
Guest.belongsTo(AuthMethod, { foreignKey: 'auth_method_id' });

Guest.hasMany(Session, { foreignKey: 'guest_id' });
Session.belongsTo(Guest, { foreignKey: 'guest_id' });

Organization.hasMany(Session, { foreignKey: 'organization_id' });
Session.belongsTo(Organization, { foreignKey: 'organization_id' });

Organization.hasMany(Log5651, { foreignKey: 'organization_id' });
Log5651.belongsTo(Organization, { foreignKey: 'organization_id' });

Session.hasMany(Log5651, { foreignKey: 'session_id' });
Log5651.belongsTo(Session, { foreignKey: 'session_id' });

Organization.hasMany(HotspotPackage, { foreignKey: 'organization_id' });
HotspotPackage.belongsTo(Organization, { foreignKey: 'organization_id' });

Guest.hasMany(GuestPackage, { foreignKey: 'guest_id' });
GuestPackage.belongsTo(Guest, { foreignKey: 'guest_id' });

HotspotPackage.hasMany(GuestPackage, { foreignKey: 'package_id' });
GuestPackage.belongsTo(HotspotPackage, { foreignKey: 'package_id' });

module.exports = {
  sequelize,
  Organization,
  Role,
  User,
  Permission,
  RolePermission,
  FirewallType,
  FirewallConfig,
  AuthMethod,
  OrganizationAuthMethod,
  PMSIntegration,
  Guest,
  Session,
  Log5651,
  HotspotPackage,
  GuestPackage
};
