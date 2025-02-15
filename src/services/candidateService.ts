import {
  axiosInstance,
  PaginatedResponse,
  handleApiError,
  extractErrorMessage,
} from './api';
import { Job } from '@/features/jobs/jobSlice';

interface RoleDTO {
  id: number;
  name: string;
}

interface StatusDTO {
  id: number;
  name: string;
}

interface UserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: number | null;
  birthDay: string | null;
  phone: string | null;
  avatar: string | null;
  location: string | null;
  mailReceive: boolean;
  roleDTO: RoleDTO;
  statusDTO: StatusDTO;
}

interface UniversityDTO {
  id: number;
  name: string;
}

interface PositionDTO {
  id: number;
  name: string;
}

interface MajorDTO {
  id: number;
  name: string;
}

interface ScheduleDTO {
  id: number;
  name: string;
}

interface CandidateOtherInfoDTO {
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

export interface Candidate {
  id: number;
  userDTO: UserDTO;
  candidateOtherInfoDTO: CandidateOtherInfoDTO;
}

export interface Application {
  id: number;
  candidateId: number;
  jobId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  job: Job;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCandidateRequest {
  about?: string;
  education?: string;
  experience?: string;
  skills?: string;
  cv?: File;
}

export interface ApplicationFilters {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  no: number;
  limit: number;
}

export interface RegisterCandidateRequest {
  userCreationDTO: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  candidateOtherInfoDTO: null;
}

export const candidateService = {
  async getProfile(userId: number): Promise<Candidate> {
    try {
      const response = await axiosInstance.get<Candidate>(
        `/candidate/user/${userId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateProfile(data: UpdateCandidateRequest): Promise<Candidate> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await axiosInstance.put<Candidate>(
        '/candidate/profile',
        formData,
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

  async getApplications(
    filters: ApplicationFilters
  ): Promise<PaginatedResponse<Application>> {
    try {
      const response = await axiosInstance.get<PaginatedResponse<Application>>(
        '/candidate/applications',
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async applyForJob(jobId: number): Promise<void> {
    try {
      await axiosInstance.post(`/candidate/jobs/${jobId}/apply`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async withdrawApplication(jobId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/candidate/jobs/${jobId}/apply`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getRecommendedJobs(): Promise<Job[]> {
    try {
      const response = await axiosInstance.get<Job[]>(
        '/candidate/jobs/recommended'
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async register(data: RegisterCandidateRequest): Promise<void> {
    try {
      await axiosInstance.post('/candidate', data);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
