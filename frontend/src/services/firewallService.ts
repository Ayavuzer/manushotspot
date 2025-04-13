import api from './api';
import { FirewallType, FirewallConfig, ApiResponse } from '../types';

// Firewall API calls
export const firewallApi = {
  getAllFirewallTypes: async (): Promise<ApiResponse<{ firewallTypes: FirewallType[] }>> => {
    const response = await api.get<ApiResponse<{ firewallTypes: FirewallType[] }>>('/firewalls/types');
    return response.data;
  },
  
  getAllFirewallConfigs: async (): Promise<ApiResponse<{ firewallConfigs: FirewallConfig[] }>> => {
    const response = await api.get<ApiResponse<{ firewallConfigs: FirewallConfig[] }>>('/firewalls');
    return response.data;
  },
  
  getFirewallConfigById: async (id: number): Promise<ApiResponse<{ firewallConfig: FirewallConfig }>> => {
    const response = await api.get<ApiResponse<{ firewallConfig: FirewallConfig }>>(`/firewalls/${id}`);
    return response.data;
  },
  
  createFirewallConfig: async (data: Partial<FirewallConfig>): Promise<ApiResponse<{ firewallConfig: FirewallConfig }>> => {
    const response = await api.post<ApiResponse<{ firewallConfig: FirewallConfig }>>('/firewalls', data);
    return response.data;
  },
  
  updateFirewallConfig: async (id: number, data: Partial<FirewallConfig>): Promise<ApiResponse<{ firewallConfig: FirewallConfig }>> => {
    const response = await api.put<ApiResponse<{ firewallConfig: FirewallConfig }>>(`/firewalls/${id}`, data);
    return response.data;
  },
  
  deleteFirewallConfig: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/firewalls/${id}`);
    return response.data;
  },
  
  testFirewallConnection: async (id: number): Promise<ApiResponse<{ status: string }>> => {
    const response = await api.post<ApiResponse<{ status: string }>>(`/firewalls/${id}/test-connection`);
    return response.data;
  }
};
