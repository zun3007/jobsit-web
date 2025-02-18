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
  type: string;
  email: string;
  role: string;
  avatar: string | null;
  idUser: number;
  message: string | null;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: number;
  avatar?: string;
}

export interface RoleDTO {
  id: number;
  name: string;
}

export interface StatusDTO {
  id: number;
  name: string;
}

export interface UserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: number | null;
  birthDay: string | null;
  phone: string;
  avatar: string | null;
  location: string | null;
  mailReceive: boolean;
  roleDTO: RoleDTO;
  statusDTO: StatusDTO;
}

export interface UniversityDTO {
  id: number;
  name: string;
}

export interface PositionDTO {
  id: number;
  name: string;
}

export interface MajorDTO {
  id: number;
  name: string;
}

export interface ScheduleDTO {
  id: number;
  name: string;
}

export interface CandidateOtherInfoDTO {
  universityDTO: UniversityDTO | null;
  referenceLetter: string | null;
  searchable: boolean;
  positionDTOs: PositionDTO[];
  majorDTOs: MajorDTO[];
  scheduleDTOs: ScheduleDTO[];
  desiredJob: string | null;
  desiredWorkingProvince: string | null;
  cv: string | null;
}

export interface User {
  id: number;
  userDTO: UserDTO;
  candidateOtherInfoDTO: CandidateOtherInfoDTO;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>('/login', data);
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
      await axiosInstance.get(`/user/forgot-password/${email}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async changePasswordByOTP(otp: string, newPassword: string): Promise<void> {
    try {
      await axiosInstance.post('/user/change-password-by-otp', {
        otp,
        newPassword,
        confirmPassword: newPassword,
      });
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
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('Not authenticated');
      }
      const { id } = JSON.parse(userData);
      const response = await axiosInstance.get<User>(`/candidate/user/${id}`);
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
      await axiosInstance.put('/user/change-password', {
        oldPassword,
        newPassword,
        confirmPassword: newPassword,
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async verifyOTP(otp: string): Promise<void> {
    try {
      await axiosInstance.get(`/active?otp=${otp}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async resendOTP(email: string): Promise<void> {
    try {
      await axiosInstance.get(`/mail/active-user?email=${email}`);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
