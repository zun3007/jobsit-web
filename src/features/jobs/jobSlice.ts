import { createSlice } from '@reduxjs/toolkit';

export interface Job {
  id: number;
  name: string;
  description: string;
  requirements: string;
  benefits: string;
  salary: string;
  quantity: number;
  position: string;
  major: string;
  schedule: string;
  provinceName: string;
  companyId: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  createdAt: string;
  updatedAt: string;
}

interface JobState {
  jobs: Job[];
  selectedJob: Job | null;
  savedJobs: number[];
  filters: {
    schedule?: string;
    position?: string;
    major?: string;
    name?: string;
    provinceName?: string;
    page: number;
    limit: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  selectedJob: null,
  savedJobs: [],
  filters: {
    page: 0,
    limit: 10,
  },
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
});

export default jobSlice.reducer;
