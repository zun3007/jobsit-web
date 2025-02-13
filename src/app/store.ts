import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from '@/features/auth/authSlice';
import uiReducer from '@/features/ui/uiSlice';
import filterReducer from '@/features/filters/filterSlice';
import applicationReducer from '@/features/applications/applicationSlice';
import demandReducer from '@/features/demands/demandSlice';
import jobReducer from '@/features/jobs/jobSlice';
import companyReducer from '@/features/companies/companySlice';
import candidateReducer from '@/features/candidates/candidateSlice';
import universityReducer from '@/features/universities/universitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    filters: filterReducer,
    applications: applicationReducer,
    demands: demandReducer,
    jobs: jobReducer,
    companies: companyReducer,
    candidates: candidateReducer,
    universities: universityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'auth/setCredentials',
          'candidates/updateProfile',
          'companies/updateCompany',
          'universities/updateUniversity',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'payload.timestamp',
          'payload.cv',
          'payload.logo',
          'payload.avatar',
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'auth.user.timestamp',
          'candidates.profile.cv',
          'companies.selectedCompany.logo',
          'universities.selectedUniversity.logo',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
