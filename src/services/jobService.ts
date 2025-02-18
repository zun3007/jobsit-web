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
      // Use /job/filter only when there are actual filter criteria
      const hasFilters =
        filters.name ||
        filters.provinceName ||
        filters.schedule ||
        filters.position ||
        filters.major;

      const endpoint = hasFilters ? '/job/filter' : '/job';

      const response = await axiosInstance.get<JobResponse>(endpoint, {
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
      const response = await axiosInstance.get('/candidate-job-care/job-save');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getSavedJobIds(): Promise<number[]> {
    try {
      const response = await axiosInstance.get('/candidate-job-care/job-save');
      return response.data.map((job: Job) => job.id);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async saveJob(jobId: number): Promise<void> {
    try {
      await axiosInstance.post(`/candidate-job-care?idJob=${jobId}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async unsaveJob(jobId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/candidate-job-care?idJob=${jobId}`);
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
    const response = await axiosInstance.get('/jobs/recommended');
    return response.data;
  },
};
