import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface JobFilters {
  schedule?: string;
  position?: string;
  major?: string;
  name?: string;
  provinceName?: string;
  no: number;
  limit: number;
}

export interface UniversityFilters {
  name?: string;
  universityTypeIds?: string[];
  majorIds?: string[];
  no: number;
  limit: number;
}

interface FilterState {
  jobs: JobFilters;
  universities: UniversityFilters;
  savedFilters: {
    [key: string]: any;
  };
}

const initialState: FilterState = {
  jobs: {
    no: 0,
    limit: 5,
  },
  universities: {
    no: 0,
    limit: 10,
  },
  savedFilters: {},
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setJobFilters: (state, action: PayloadAction<Partial<JobFilters>>) => {
      state.jobs = { ...state.jobs, ...action.payload };
    },
    resetJobFilters: (state) => {
      state.jobs = initialState.jobs;
    },
    setUniversityFilters: (
      state,
      action: PayloadAction<Partial<UniversityFilters>>
    ) => {
      state.universities = { ...state.universities, ...action.payload };
    },
    resetUniversityFilters: (state) => {
      state.universities = initialState.universities;
    },
    saveFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.savedFilters[action.payload.key] = action.payload.value;
    },
    clearSavedFilter: (state, action: PayloadAction<string>) => {
      delete state.savedFilters[action.payload];
    },
    clearAllSavedFilters: (state) => {
      state.savedFilters = {};
    },
  },
});

export const {
  setJobFilters,
  resetJobFilters,
  setUniversityFilters,
  resetUniversityFilters,
  saveFilter,
  clearSavedFilter,
  clearAllSavedFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
