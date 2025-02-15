import { axiosInstance, handleApiError } from './api';
import { Job } from '@/features/jobs/jobSlice';

export interface Application {
  id: number;
  jobDTO: Job;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  cv: string;
  referenceLetter: string;
  appliedDate: string;
}

export interface ApplicationResponse {
  contents: Application[];
  totalItems: number;
  totalPages: number;
}

export const applicationService = {
  async getCandidateApplications(
    page: number = 0,
    limit: number = 5
  ): Promise<ApplicationResponse> {
    try {
      const response = await axiosInstance.get<ApplicationResponse>(
        `/candidate-application/candidate`,
        {
          params: {
            no: page,
            limit,
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async applyForJob(formData: FormData): Promise<void> {
    try {
      await axiosInstance.post('/candidate-application', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async withdrawApplication(applicationId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/candidate-application/${applicationId}`);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
