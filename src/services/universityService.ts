import { axiosInstance, PaginatedResponse, handleApiError } from './api';
import { UniversityFilters } from '@/features/filters/filterSlice';

export interface University {
  id: number;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  location: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface UniversityDemand {
  id: number;
  universityId: number;
  title: string;
  description: string;
  requirements: string;
  major: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateDemandRequest {
  title: string;
  description: string;
  requirements: string;
  major: string;
  deadline: string;
}

export interface UpdateDemandRequest extends Partial<CreateDemandRequest> {
  status?: 'OPEN' | 'CLOSED';
}

export const universityService = {
  async getUniversities(
    filters: UniversityFilters
  ): Promise<PaginatedResponse<University>> {
    try {
      const response = await axiosInstance.get<PaginatedResponse<University>>(
        '/university/filter',
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getUniversity(id: number): Promise<University> {
    try {
      const response = await axiosInstance.get<University>(`/university/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateUniversity(data: FormData): Promise<University> {
    try {
      const response = await axiosInstance.put<University>(
        '/university',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getDemands(universityId: number): Promise<UniversityDemand[]> {
    try {
      const response = await axiosInstance.get<UniversityDemand[]>(
        `/university/${universityId}/demands`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getDemand(
    universityId: number,
    demandId: number
  ): Promise<UniversityDemand> {
    try {
      const response = await axiosInstance.get<UniversityDemand>(
        `/university/${universityId}/demands/${demandId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createDemand(
    universityId: number,
    data: CreateDemandRequest
  ): Promise<UniversityDemand> {
    try {
      const response = await axiosInstance.post<UniversityDemand>(
        `/university/${universityId}/demands`,
        data
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateDemand(
    universityId: number,
    demandId: number,
    data: UpdateDemandRequest
  ): Promise<UniversityDemand> {
    try {
      const response = await axiosInstance.put<UniversityDemand>(
        `/university/${universityId}/demands/${demandId}`,
        data
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteDemand(universityId: number, demandId: number): Promise<void> {
    try {
      await axiosInstance.delete(
        `/university/${universityId}/demands/${demandId}`
      );
    } catch (error) {
      return handleApiError(error);
    }
  },
};
