import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from '@/features/auth/authSlice';
import jobReducer from '@/features/jobs/jobSlice';
import candidateReducer from '@/features/candidates/candidateSlice';
import universityReducer from '@/features/universities/universitySlice';
import companyReducer from '@/features/companies/companySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    candidates: candidateReducer,
    universities: universityReducer,
    companies: companyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
