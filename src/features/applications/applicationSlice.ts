import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Application } from '@/services/candidateService';

interface ApplicationState {
  applications: Application[];
  selectedApplication: Application | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    no: number;
    limit: number;
  };
}

const initialState: ApplicationState = {
  applications: [],
  selectedApplication: null,
  loading: false,
  error: null,
  filters: {
    no: 0,
    limit: 10,
  },
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
      state.error = null;
    },
    setSelectedApplication: (
      state,
      action: PayloadAction<Application | null>
    ) => {
      state.selectedApplication = action.payload;
    },
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.unshift(action.payload);
    },
    updateApplication: (state, action: PayloadAction<Application>) => {
      const index = state.applications.findIndex(
        (app) => app.id === action.payload.id
      );
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      if (state.selectedApplication?.id === action.payload.id) {
        state.selectedApplication = action.payload;
      }
    },
    removeApplication: (state, action: PayloadAction<number>) => {
      state.applications = state.applications.filter(
        (app) => app.id !== action.payload
      );
      if (state.selectedApplication?.id === action.payload) {
        state.selectedApplication = null;
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
        status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
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
  setApplications,
  setSelectedApplication,
  addApplication,
  updateApplication,
  removeApplication,
  setLoading,
  setError,
  setFilters,
  resetFilters,
} = applicationSlice.actions;

export default applicationSlice.reducer;
