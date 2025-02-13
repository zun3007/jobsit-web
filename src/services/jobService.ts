import { JobFilters } from '@/features/filters/filterSlice';
import { axiosInstance, handleApiError } from './api';
import { Job } from '@/features/jobs/jobSlice';

export interface JobResponse {
  contents: Job[];
  totalPages: number;
  totalItems: number;
  limit: number;
  no: number;
  first: boolean;
  last: boolean;
}

export interface CreateJobRequest {
  name: string;
  description: string;
  requirement: string;
  amount: number;
  startDate: string;
  endDate: string;
  salaryMin: number;
  salaryMax: number;
  otherInfo: string;
  location: string;
  positionIds: number[];
  majorIds: number[];
  scheduleIds: number[];
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {}

export const jobService = {
  async getJobs(filters: JobFilters): Promise<JobResponse> {
    try {
      const response = await axiosInstance.get<JobResponse>('/job/filter', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getJob(id: number): Promise<Job> {
    try {
      const response = await axiosInstance.get<Job>(`/job/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createJob(data: CreateJobRequest): Promise<Job> {
    try {
      const response = await axiosInstance.post<Job>('/job', data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateJob(id: number, data: UpdateJobRequest): Promise<Job> {
    try {
      const response = await axiosInstance.put<Job>(`/job/${id}`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteJob(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/job/${id}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getCompanyJobs(companyId: number): Promise<Job[]> {
    try {
      const response = await axiosInstance.get<Job[]>(
        `/job/company/${companyId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getSavedJobs(): Promise<Job[]> {
    try {
      const response = await axiosInstance.get<Job[]>('/job/saved');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async saveJob(jobId: number): Promise<void> {
    try {
      await axiosInstance.post(`/job/${jobId}/save`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async unsaveJob(jobId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/job/${jobId}/save`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getActiveJobsByCompany(companyId: number): Promise<JobResponse> {
    try {
      const response = await axiosInstance.get<JobResponse>(
        `/job/active/company/${companyId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getRecommendedJobs: async (): Promise<JobResponse> => {
    const response = await axiosInstance.get('/api/jobs/recommended');
    return response.data;
  },
};
