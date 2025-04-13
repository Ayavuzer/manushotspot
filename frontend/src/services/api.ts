import axios from 'axios';
import { LoginRequest, LoginResponse, ApiResponse } from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, logout
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh token
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1'}/auth/refresh-token`,
          { refreshToken }
        );
        
        const { token, refreshToken: newRefreshToken } = response.data;
        
        // Update tokens
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },
  
  getProfile: async (): Promise<ApiResponse<{ user: any }>> => {
    const response = await api.get<ApiResponse<{ user: any }>>('/auth/profile');
    return response.data;
  },
  
  updatePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<null>> => {
    const response = await api.put<ApiResponse<null>>('/auth/password', data);
    return response.data;
  }
};

export default api;
