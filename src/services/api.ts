import axios, { AxiosError } from 'axios';
import { store } from '@/app/store';
import { logout } from '@/features/auth/authSlice';

export const API_URL = 'http://localhost:8085/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Check if the error is due to token expiration
      const errorMessage = error.response?.data?.message?.toLowerCase() || '';
      if (
        errorMessage.includes('expired') ||
        errorMessage.includes('invalid token') ||
        errorMessage.includes('unauthorized')
      ) {
        // Dispatch logout action to clear auth state and local storage
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  httpCode?: number;
  message: string;
  path?: string;
}

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError;
    return data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const handleApiError = (error: unknown): never => {
  throw new Error(extractErrorMessage(error));
};
