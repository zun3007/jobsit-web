import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company, HR } from '@/services/companyService';
import { Job } from '@/services/jobService';
import { Application } from '@/services/candidateService';

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  companyJobs: Job[];
  companyApplications: { [jobId: number]: Application[] };
  hrs: HR[];
  selectedHR: HR | null;
  loading: boolean;
  error: string | null;
  filters: {
    name?: string;
    industry?: string;
    location?: string;
    no: number;
    limit: number;
  };
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  companyJobs: [],
  companyApplications: {},
  hrs: [],
  selectedHR: null,
  loading: false,
  error: null,
  filters: {
    no: 0,
    limit: 10,
  },
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload;
      state.error = null;
    },
    setSelectedCompany: (state, action: PayloadAction<Company | null>) => {
      state.selectedCompany = action.payload;
    },
    updateCompany: (state, action: PayloadAction<Company>) => {
      const index = state.companies.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.companies[index] = action.payload;
      }
      if (state.selectedCompany?.id === action.payload.id) {
        state.selectedCompany = action.payload;
      }
    },
    setCompanyJobs: (state, action: PayloadAction<Job[]>) => {
      state.companyJobs = action.payload;
    },
    addCompanyJob: (state, action: PayloadAction<Job>) => {
      state.companyJobs.unshift(action.payload);
    },
    updateCompanyJob: (state, action: PayloadAction<Job>) => {
      const index = state.companyJobs.findIndex(
        (job) => job.id === action.payload.id
      );
      if (index !== -1) {
        state.companyJobs[index] = action.payload;
      }
    },
    removeCompanyJob: (state, action: PayloadAction<number>) => {
      state.companyJobs = state.companyJobs.filter(
        (job) => job.id !== action.payload
      );
    },
    setCompanyApplications: (
      state,
      action: PayloadAction<{ jobId: number; applications: Application[] }>
    ) => {
      state.companyApplications[action.payload.jobId] =
        action.payload.applications;
    },
    updateApplication: (
      state,
      action: PayloadAction<{ jobId: number; application: Application }>
    ) => {
      const { jobId, application } = action.payload;
      const applications = state.companyApplications[jobId];
      if (applications) {
        const index = applications.findIndex(
          (app) => app.id === application.id
        );
        if (index !== -1) {
          applications[index] = application;
        }
      }
    },
    setHRs: (state, action: PayloadAction<HR[]>) => {
      state.hrs = action.payload;
    },
    setSelectedHR: (state, action: PayloadAction<HR | null>) => {
      state.selectedHR = action.payload;
    },
    addHR: (state, action: PayloadAction<HR>) => {
      state.hrs.push(action.payload);
    },
    updateHR: (state, action: PayloadAction<HR>) => {
      const index = state.hrs.findIndex((hr) => hr.id === action.payload.id);
      if (index !== -1) {
        state.hrs[index] = action.payload;
      }
      if (state.selectedHR?.id === action.payload.id) {
        state.selectedHR = action.payload;
      }
    },
    removeHR: (state, action: PayloadAction<number>) => {
      state.hrs = state.hrs.filter((hr) => hr.id !== action.payload);
      if (state.selectedHR?.id === action.payload) {
        state.selectedHR = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<{
        name?: string;
        industry?: string;
        location?: string;
        no?: number;
        limit?: number;
      }>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setCompanies,
  setSelectedCompany,
  updateCompany,
  setCompanyJobs,
  addCompanyJob,
  updateCompanyJob,
  removeCompanyJob,
  setCompanyApplications,
  updateApplication,
  setHRs,
  setSelectedHR,
  addHR,
  updateHR,
  removeHR,
  setLoading,
  setError,
  setFilters,
  resetFilters,
} = companySlice.actions;

export default companySlice.reducer;
