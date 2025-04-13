// User related types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string | null;
  is_super_admin: boolean;
  organization_id: number | null;
  last_login: string | null;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
  refreshToken: string;
}

// Organization related types
export interface Organization {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Role and Permission related types
export interface Role {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Firewall related types
export interface FirewallType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface FirewallConfig {
  id: number;
  organization_id: number;
  firewall_type_id: number;
  name: string;
  ip_address: string;
  port: number | null;
  username: string | null;
  password?: string | null;
  api_key?: string | null;
  is_active: boolean;
  connection_status: string | null;
  last_connected: string | null;
  created_at: string;
  updated_at: string;
  Organization?: Organization;
  FirewallType?: FirewallType;
}

export interface FirewallConfigRequest {
  organization_id: number;
  firewall_type_id: number;
  name: string;
  ip_address: string;
  port?: number;
  username?: string;
  password?: string;
  api_key?: string;
  is_active?: boolean;
}

// Authentication method related types
export interface AuthMethod {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationAuthMethod {
  id: number;
  organization_id: number;
  auth_method_id: number;
  is_enabled: boolean;
  config: any;
  created_at: string;
  updated_at: string;
  Organization?: Organization;
  AuthMethod?: AuthMethod;
}

// PMS Integration related types
export interface PMSIntegration {
  id: number;
  organization_id: number;
  name: string;
  pms_type: string;
  api_url: string | null;
  username: string | null;
  is_active: boolean;
  connection_status: string | null;
  last_connected: string | null;
  created_at: string;
  updated_at: string;
  Organization?: Organization;
}

// Guest and Session related types
export interface Guest {
  id: number;
  organization_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  id_number: string | null;
  room_number: string | null;
  auth_method_id: number | null;
  auth_reference: string | null;
  created_at: string;
  updated_at: string;
  Organization?: Organization;
  AuthMethod?: AuthMethod;
}

export interface Session {
  id: number;
  guest_id: number;
  organization_id: number;
  ip_address: string;
  mac_address: string;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  data_usage_bytes: number;
  status: string;
  created_at: string;
  updated_at: string;
  Guest?: Guest;
  Organization?: Organization;
}

// 5651 Log related types
export interface Log5651 {
  id: number;
  organization_id: number;
  session_id: number;
  ip_address: string;
  mac_address: string;
  destination_ip: string;
  destination_port: number;
  protocol: string;
  timestamp: string;
  action: string;
  created_at: string;
  Organization?: Organization;
  Session?: Session;
}

// Hotspot Package related types
export interface HotspotPackage {
  id: number;
  organization_id: number;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  data_limit_bytes: number | null;
  bandwidth_limit_kbps: number | null;
  price: number | null;
  currency: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  Organization?: Organization;
}

export interface GuestPackage {
  id: number;
  guest_id: number;
  package_id: number;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  Guest?: Guest;
  HotspotPackage?: HotspotPackage;
}

// API response types
export interface ApiResponse<T> {
  message?: string;
  [key: string]: any;
}
