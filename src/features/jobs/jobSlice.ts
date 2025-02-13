import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobFilters } from '@/features/filters/filterSlice';

interface Company {
  id: number;
  name: string;
  logo: string | null;
  description: string;
  website: string;
  email: string;
  phone: string | null;
  tax: string | null;
  createdDate: string;
  location: string;
  personnelSize: string;
  statusDTO: {
    id: number;
    name: string;
  };
}

interface Position {
  id: number;
  name: string;
}

interface Major {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  name: string;
}

export interface Job {
  id: number;
  name: string;
  companyDTO: Company;
  positionDTOs: Position[];
  majorDTOs: Major[];
  scheduleDTOs: Schedule[];
  amount: number;
  startDate: string;
  endDate: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirement: string;
  otherInfo: string;
  location: string;
}

interface JobState {
  jobs: Job[];
  selectedJob: Job | null;
  savedJobs: number[];
  totalJobs: number;
  loading: boolean;
  error: string | null;
  filters: JobFilters;
  schedules: string[];
  positions: string[];
  majors: string[];
  provinces: string[];
}

const initialState: JobState = {
  jobs: [],
  selectedJob: null,
  savedJobs: [],
  totalJobs: 0,
  loading: false,
  error: null,
  filters: {
    no: 0,
    limit: 10,
  },
  schedules: [],
  positions: [],
  majors: [],
  provinces: [],
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<{ jobs: Job[]; total: number }>) => {
      state.jobs = action.payload.jobs;
      state.totalJobs = action.payload.total;
      state.error = null;
    },
    setSelectedJob: (state, action: PayloadAction<Job | null>) => {
      state.selectedJob = action.payload;
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.unshift(action.payload);
      state.totalJobs += 1;
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
      if (state.selectedJob?.id === action.payload.id) {
        state.selectedJob = action.payload;
      }
    },
    removeJob: (state, action: PayloadAction<number>) => {
      state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      state.totalJobs -= 1;
      if (state.selectedJob?.id === action.payload) {
        state.selectedJob = null;
      }
    },
    setSavedJobs: (state, action: PayloadAction<number[]>) => {
      state.savedJobs = action.payload;
    },
    addSavedJob: (state, action: PayloadAction<number>) => {
      if (!state.savedJobs.includes(action.payload)) {
        state.savedJobs.push(action.payload);
      }
    },
    removeSavedJob: (state, action: PayloadAction<number>) => {
      state.savedJobs = state.savedJobs.filter((id) => id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<JobFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSchedules: (state, action: PayloadAction<string[]>) => {
      state.schedules = action.payload;
    },
    setPositions: (state, action: PayloadAction<string[]>) => {
      state.positions = action.payload;
    },
    setMajors: (state, action: PayloadAction<string[]>) => {
      state.majors = action.payload;
    },
    setProvinces: (state, action: PayloadAction<string[]>) => {
      state.provinces = action.payload;
    },
  },
});

export const {
  setJobs,
  setSelectedJob,
  addJob,
  updateJob,
  removeJob,
  setSavedJobs,
  addSavedJob,
  removeSavedJob,
  setLoading,
  setError,
  setFilters,
  resetFilters,
  setSchedules,
  setPositions,
  setMajors,
  setProvinces,
} = jobSlice.actions;

export default jobSlice.reducer;
