import { axiosInstance } from './api';
import { Job } from '@/features/jobs/jobSlice';

export interface Application {
  id: number;
  job: Job;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationResponse {
  contents: Application[];
  totalPages: number;
  totalItems: number;
  limit: number;
  no: number;
  first: boolean;
  last: boolean;
}

export const applicationService = {
  getCandidateApplications: async (): Promise<ApplicationResponse> => {
    const response = await axiosInstance.get('/api/candidate-applications');
    return response.data;
  },

  applyForJob: async (jobId: number, cvFile: File): Promise<Application> => {
    const formData = new FormData();
    formData.append('jobId', jobId.toString());
    formData.append('cvFile', cvFile);

    const response = await axiosInstance.post(
      '/api/candidate-applications',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  withdrawApplication: async (applicationId: number): Promise<void> => {
    await axiosInstance.delete(`/api/candidate-applications/${applicationId}`);
  },
};
