import api from './api';
import { User, ApiResponse } from '../types';

// User API calls
export const userApi = {
  getAllUsers: async (): Promise<ApiResponse<{ users: User[] }>> => {
    const response = await api.get<ApiResponse<{ users: User[] }>>('/users');
    return response.data;
  },
  
  getUserById: async (id: number): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return response.data;
  },
  
  createUser: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post<ApiResponse<{ user: User }>>('/users', data);
    return response.data;
  },
  
  updateUser: async (id: number, data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}`, data);
    return response.data;
  },
  
  deleteUser: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`);
    return response.data;
  }
};
