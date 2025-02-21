import { axiosInstance, handleApiError } from './api';

export interface HRCreationDTO {
  userCreationDTO: {
    email: string;
    password: string;
    confirmPassword: string;
    lastName: string;
    firstName: string;
    phone: string;
    gender: number;
  };
  hrOtherInfoDTO: {
    position: string;
    companyDTO: {
      name: string;
      tax: string;
    };
  };
}

export interface HR {
  id: number;
  userDTO: {
    id: number;
    email: string;
    lastName: string;
    firstName: string;
    phone: string;
    gender: number;
    avatar: string | null;
    location: string | null;
    birthDay: string | null;
  };
  position: string;
  companyDTO: {
    id: number;
    name: string;
    tax: string;
    logo: string | null;
    description: string | null;
    website: string | null;
  };
}

export const hrService = {
  async getHR(id: number): Promise<HR> {
    try {
      const response = await axiosInstance.get<HR>(`/hr/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getHRByUserId(userId: number): Promise<HR> {
    try {
      const response = await axiosInstance.get<HR>(`/hr/user/${userId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createHR(data: HRCreationDTO): Promise<HR> {
    try {
      const response = await axiosInstance.post<HR>('/hr', data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
