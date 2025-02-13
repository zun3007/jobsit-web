import { axiosInstance, PaginatedResponse, handleApiError } from './api';
import { Application } from './candidateService';

export interface Company {
  id: number;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  email: string;
  phone?: string;
  tax?: string;
  industry?: string;
  size?: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface HR {
  id: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: number;
  avatar?: string;
  companyId: number;
  company: Company;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  description?: string;
  logo?: File;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
}

export interface CreateHRRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: number;
}

export const companyService = {
  async getCompany(id: number): Promise<Company> {
    try {
      const response = await axiosInstance.get<Company>(`/company/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateCompany(data: UpdateCompanyRequest): Promise<Company> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await axiosInstance.put<Company>('/company', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getHRs(): Promise<HR[]> {
    try {
      const response = await axiosInstance.get<HR[]>('/company/hr');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createHR(data: CreateHRRequest): Promise<HR> {
    try {
      const response = await axiosInstance.post<HR>('/company/hr', data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateHR(id: number, data: Partial<CreateHRRequest>): Promise<HR> {
    try {
      const response = await axiosInstance.put<HR>(`/company/hr/${id}`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteHR(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/company/hr/${id}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getApplications(jobId: number): Promise<Application[]> {
    try {
      const response = await axiosInstance.get<Application[]>(
        `/company/jobs/${jobId}/applications`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateApplicationStatus(
    jobId: number,
    applicationId: number,
    status: 'ACCEPTED' | 'REJECTED'
  ): Promise<void> {
    try {
      await axiosInstance.put(
        `/company/jobs/${jobId}/applications/${applicationId}`,
        { status }
      );
    } catch (error) {
      return handleApiError(error);
    }
  },
};
