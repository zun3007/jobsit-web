import { createSlice } from '@reduxjs/toolkit';
import { User } from '@/features/auth/authSlice';

export interface CandidateProfile {
  id: number;
  user: User;
  university: {
    id: number;
    name: string;
  };
  cv: string | null;
  referenceLetter: string | null;
  positions: Array<{
    id: number;
    name: string;
  }>;
  majors: Array<{
    id: number;
    name: string;
  }>;
  schedules: Array<{
    id: number;
    name: string;
  }>;
  desiredJob: string;
  desiredWorkingProvince: string;
  searchable: boolean;
}

export interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  cv: string;
  referenceLetter: string;
  createdAt: string;
  updatedAt: string;
}

interface CandidateState {
  profile: CandidateProfile | null;
  applications: Application[];
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  profile: null,
  applications: [],
  loading: false,
  error: null,
};

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {},
});

export default candidateSlice.reducer;
