import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HR } from '@/services/hrService';

interface HRState {
  currentHR: HR | null;
  loading: boolean;
  error: string | null;
}

const initialState: HRState = {
  currentHR: null,
  loading: false,
  error: null,
};

const hrSlice = createSlice({
  name: 'hr',
  initialState,
  reducers: {
    setCurrentHR: (state, action: PayloadAction<HR | null>) => {
      state.currentHR = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCurrentHR, setLoading, setError } = hrSlice.actions;
export default hrSlice.reducer;
