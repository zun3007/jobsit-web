import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const queryKeys = {
  auth: {
    root: ['auth'],
    user: () => [...queryKeys.auth.root, 'user'],
    profile: () => [...queryKeys.auth.root, 'profile'],
  },
  jobs: {
    root: ['jobs'],
    all: () => [...queryKeys.jobs.root, 'all'],
    detail: (id: string) => [...queryKeys.jobs.root, 'detail', id],
    search: (params: Record<string, any>) => [
      ...queryKeys.jobs.root,
      'search',
      params,
    ],
  },
  candidates: {
    root: ['candidates'],
    applications: () => [...queryKeys.candidates.root, 'applications'],
    saved: () => [...queryKeys.candidates.root, 'saved'],
  },
  companies: {
    root: ['companies'],
    all: () => [...queryKeys.companies.root, 'all'],
    detail: (id: string) => [...queryKeys.companies.root, 'detail', id],
  },
  universities: {
    root: ['universities'],
    all: () => [...queryKeys.universities.root, 'all'],
    detail: (id: string) => [...queryKeys.universities.root, 'detail', id],
  },
};

export type ErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};

export const extractErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return (error.response?.data as ErrorResponse)?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
