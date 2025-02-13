import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { University } from '@/services/universityService';
import { UniversityFilters } from '@/features/filters/filterSlice';

export interface UniversityDemand {
  id: number;
  university: University;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  createdAt: string;
  updatedAt: string;
}

interface UniversityState {
  universities: University[];
  selectedUniversity: University | null;
  totalUniversities: number;
  loading: boolean;
  error: string | null;
  filters: UniversityFilters;
  types: Array<{ id: number; name: string }>;
  majors: Array<{ id: number; name: string }>;
  demands: UniversityDemand[];
}

const initialState: UniversityState = {
  universities: [],
  selectedUniversity: null,
  totalUniversities: 0,
  loading: false,
  error: null,
  filters: {
    no: 0,
    limit: 10,
  },
  types: [],
  majors: [],
  demands: [],
};

const universitySlice = createSlice({
  name: 'universities',
  initialState,
  reducers: {
    setUniversities: (
      state,
      action: PayloadAction<{ universities: University[]; total: number }>
    ) => {
      state.universities = action.payload.universities;
      state.totalUniversities = action.payload.total;
      state.error = null;
    },
    setSelectedUniversity: (
      state,
      action: PayloadAction<University | null>
    ) => {
      state.selectedUniversity = action.payload;
    },
    updateUniversity: (state, action: PayloadAction<University>) => {
      const index = state.universities.findIndex(
        (uni) => uni.id === action.payload.id
      );
      if (index !== -1) {
        state.universities[index] = action.payload;
      }
      if (state.selectedUniversity?.id === action.payload.id) {
        state.selectedUniversity = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<UniversityFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setTypes: (
      state,
      action: PayloadAction<Array<{ id: number; name: string }>>
    ) => {
      state.types = action.payload;
    },
    setMajors: (
      state,
      action: PayloadAction<Array<{ id: number; name: string }>>
    ) => {
      state.majors = action.payload;
    },
  },
});

export const {
  setUniversities,
  setSelectedUniversity,
  updateUniversity,
  setLoading,
  setError,
  setFilters,
  resetFilters,
  setTypes,
  setMajors,
} = universitySlice.actions;

export default universitySlice.reducer;
