import api from './api';
import { Organization, ApiResponse } from '../types';

// Organization API calls
export const organizationApi = {
  getAllOrganizations: async (): Promise<ApiResponse<{ organizations: Organization[] }>> => {
    const response = await api.get<ApiResponse<{ organizations: Organization[] }>>('/organizations');
    return response.data;
  },
  
  getOrganizationById: async (id: number): Promise<ApiResponse<{ organization: Organization }>> => {
    const response = await api.get<ApiResponse<{ organization: Organization }>>(`/organizations/${id}`);
    return response.data;
  },
  
  createOrganization: async (data: Partial<Organization>): Promise<ApiResponse<{ organization: Organization }>> => {
    const response = await api.post<ApiResponse<{ organization: Organization }>>('/organizations', data);
    return response.data;
  },
  
  updateOrganization: async (id: number, data: Partial<Organization>): Promise<ApiResponse<{ organization: Organization }>> => {
    const response = await api.put<ApiResponse<{ organization: Organization }>>(`/organizations/${id}`, data);
    return response.data;
  },
  
  deleteOrganization: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/organizations/${id}`);
    return response.data;
  }
};
