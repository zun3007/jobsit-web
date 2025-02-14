import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate } from '@/services/candidateService';
import { Job } from '@/services/jobService';

interface CandidateState {
  profile: Candidate | null;
  recommendedJobs: Job[];
  savedJobs: Job[];
  savedJobIds: number[];
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  profile: null,
  recommendedJobs: [],
  savedJobs: [],
  savedJobIds: [],
  loading: false,
  error: null,
};

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Candidate>) => {
      state.profile = action.payload;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<Candidate>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setRecommendedJobs: (state, action: PayloadAction<Job[]>) => {
      state.recommendedJobs = action.payload;
    },
    setSavedJobs: (state, action: PayloadAction<Job[]>) => {
      state.savedJobs = action.payload;
      state.savedJobIds = action.payload.map((job) => job.id);
    },
    addSavedJob: (state, action: PayloadAction<Job>) => {
      state.savedJobs.unshift(action.payload);
      state.savedJobIds.push(action.payload.id);
    },
    removeSavedJob: (state, action: PayloadAction<number>) => {
      state.savedJobs = state.savedJobs.filter(
        (job) => job.id !== action.payload
      );
      state.savedJobIds = state.savedJobIds.filter(
        (id) => id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.recommendedJobs = [];
      state.savedJobs = [];
      state.savedJobIds = [];
      state.error = null;
    },
  },
});

export const {
  setProfile,
  updateProfile,
  setRecommendedJobs,
  setSavedJobs,
  addSavedJob,
  removeSavedJob,
  setLoading,
  setError,
  clearProfile,
} = candidateSlice.actions;

export default candidateSlice.reducer;
