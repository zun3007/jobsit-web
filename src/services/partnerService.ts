import { axiosInstance, handleApiError } from './api';

export interface PartnerCreationDTO {
  userCreationDTO: {
    email: string;
    password: string;
    confirmPassword: string;
    lastName: string;
    firstName: string;
    phone: string;
    gender: number;
  };
  partnerOtherInfoDTO: {
    position: string;
    universityDTO: {
      name: string;
      shortName: string;
    };
  };
}

export interface PartnerProfileDTO {
  userProfileDTO: {
    lastName: string;
    firstName: string;
    email: string;
    gender: number;
    phone: string;
    birthDay: string;
    location: string;
  };
  partnerOtherInfoDTO: {
    position: string;
  };
}

export interface InternshipProgrammeDTO {
  title: string;
  majorDTOs: { id: number }[];
  recommendation: string;
  positionDTOs: { id: number }[];
  startDate: string;
  endDate: string;
  students: string;
  amount: number;
  location: string;
}

export interface InternshipProgramme extends InternshipProgrammeDTO {
  id: number;
  status: string;
  file: string;
}

export interface ProgrammeSearchParams {
  title?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  statusId?: number;
  no?: number;
  limit?: number;
}

export interface ProgrammeResponse {
  contents: InternshipProgramme[];
  totalPages: number;
  totalItems: number;
  limit: number;
  no: number;
  first: boolean;
  last: boolean;
}

export const partnerService = {
  async createPartner(data: PartnerCreationDTO): Promise<void> {
    try {
      await axiosInstance.post('/partner', data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updatePartnerProfile(
    data: PartnerProfileDTO,
    fileAvatar?: File
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('partnerProfileDTO', JSON.stringify(data));
      if (fileAvatar) {
        formData.append('fileAvatar', fileAvatar);
      }
      await axiosInstance.put('/partner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async searchInternshipProgrammes(
    params: ProgrammeSearchParams
  ): Promise<ProgrammeResponse> {
    try {
      const response = await axiosInstance.get<ProgrammeResponse>(
        '/partner/search',
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createInternshipProgramme(
    data: InternshipProgrammeDTO,
    file: File
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('internshipProgrammeDTO', JSON.stringify(data));
      formData.append('file', file);
      await axiosInstance.post('/internship-programme', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateInternshipProgramme(
    id: number,
    data: InternshipProgrammeDTO,
    file?: File
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('internshipProgrammeDTO', JSON.stringify(data));
      if (file) {
        formData.append('file', file);
      }
      await axiosInstance.put(`/internship-programme/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateProgrammeStatus(id: number, open: boolean): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('open', open.toString());
      await axiosInstance.put(`/internship-programme/status/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteInternshipProgramme(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/internship-programme/${id}`);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
