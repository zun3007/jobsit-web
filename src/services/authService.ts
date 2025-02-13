import { User } from '@/features/auth/authSlice';
import { axiosInstance, handleApiError } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: number;
  avatar?: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        '/auth/login',
        data
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async register(data: RegisterRequest): Promise<void> {
    try {
      await axiosInstance.post('/auth/register', data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await axiosInstance.post(`/user/forgot-password/${email}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await axiosInstance.post('/user/reset-password', {
        token,
        newPassword,
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>('/user/profile');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    try {
      const response = await axiosInstance.put<User>('/user/profile', data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await axiosInstance.post('/user/change-password', {
        oldPassword,
        newPassword,
      });
    } catch (error) {
      return handleApiError(error);
    }
  },
};
