import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: {
    [key: string]: boolean;
  };
  modals: {
    [key: string]: boolean;
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  loading: {},
  modals: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLoading: (
      state,
      action: PayloadAction<{ key: string; value: boolean }>
    ) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    toggleModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    setModal: (
      state,
      action: PayloadAction<{ key: string; value: boolean }>
    ) => {
      state.modals[action.payload.key] = action.payload.value;
    },
  },
});

export const { toggleSidebar, setTheme, setLoading, toggleModal, setModal } =
  uiSlice.actions;

export default uiSlice.reducer;
