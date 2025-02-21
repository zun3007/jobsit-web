import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InternshipProgramme } from '@/services/partnerService';

interface PartnerState {
  programmes: InternshipProgramme[];
  loading: boolean;
  error: string | null;
  filters: {
    title?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    statusId?: number;
    no: number;
    limit: number;
  };
}

const initialState: PartnerState = {
  programmes: [],
  loading: false,
  error: null,
  filters: {
    no: 0,
    limit: 10,
  },
};

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setProgrammes: (state, action: PayloadAction<InternshipProgramme[]>) => {
      state.programmes = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<PartnerState['filters']>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setProgrammes, setLoading, setError, setFilters, resetFilters } =
  partnerSlice.actions;
export default partnerSlice.reducer;
