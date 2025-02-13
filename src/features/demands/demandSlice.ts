import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UniversityDemand } from '@/services/universityService';

interface DemandState {
  demands: UniversityDemand[];
  selectedDemand: UniversityDemand | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: 'OPEN' | 'CLOSED';
    major?: string;
    no: number;
    limit: number;
  };
}

const initialState: DemandState = {
  demands: [],
  selectedDemand: null,
  loading: false,
  error: null,
  filters: {
    no: 0,
    limit: 10,
  },
};

const demandSlice = createSlice({
  name: 'demands',
  initialState,
  reducers: {
    setDemands: (state, action: PayloadAction<UniversityDemand[]>) => {
      state.demands = action.payload;
      state.error = null;
    },
    setSelectedDemand: (
      state,
      action: PayloadAction<UniversityDemand | null>
    ) => {
      state.selectedDemand = action.payload;
    },
    addDemand: (state, action: PayloadAction<UniversityDemand>) => {
      state.demands.unshift(action.payload);
    },
    updateDemand: (state, action: PayloadAction<UniversityDemand>) => {
      const index = state.demands.findIndex(
        (demand) => demand.id === action.payload.id
      );
      if (index !== -1) {
        state.demands[index] = action.payload;
      }
      if (state.selectedDemand?.id === action.payload.id) {
        state.selectedDemand = action.payload;
      }
    },
    removeDemand: (state, action: PayloadAction<number>) => {
      state.demands = state.demands.filter(
        (demand) => demand.id !== action.payload
      );
      if (state.selectedDemand?.id === action.payload) {
        state.selectedDemand = null;
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
        status?: 'OPEN' | 'CLOSED';
        major?: string;
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
  setDemands,
  setSelectedDemand,
  addDemand,
  updateDemand,
  removeDemand,
  setLoading,
  setError,
  setFilters,
  resetFilters,
} = demandSlice.actions;

export default demandSlice.reducer;
