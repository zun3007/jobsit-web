import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
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
    all: (params?: Record<string, any>) => [
      ...queryKeys.jobs.root,
      'all',
      params,
    ],
    detail: (id: string) => [...queryKeys.jobs.root, 'detail', id],
    company: (companyId: string) => [
      ...queryKeys.jobs.root,
      'company',
      companyId,
    ],
    search: (filters: Record<string, any>) => [
      ...queryKeys.jobs.root,
      'search',
      filters,
    ],
    saved: () => [...queryKeys.jobs.root, 'saved'],
  },
  applications: {
    root: ['applications'],
    all: (page?: number, limit?: number) => [
      ...queryKeys.applications.root,
      'all',
      { page, limit },
    ],
  },
  candidates: {
    root: ['candidates'],
    profile: (id: string) => [...queryKeys.candidates.root, 'profile', id],
    applications: (params?: Record<string, any>) => [
      ...queryKeys.candidates.root,
      'applications',
      params,
    ],
    saved: () => [...queryKeys.candidates.root, 'saved'],
  },
  companies: {
    root: ['companies'],
    all: (params?: Record<string, any>) => [
      ...queryKeys.companies.root,
      'all',
      params,
    ],
    detail: (id: string) => [...queryKeys.companies.root, 'detail', id],
  },
  universities: {
    root: ['universities'],
    all: (params?: Record<string, any>) => [
      ...queryKeys.universities.root,
      'all',
      params,
    ],
    detail: (id: string) => [...queryKeys.universities.root, 'detail', id],
    demands: {
      all: (params?: Record<string, any>) => [
        ...queryKeys.universities.root,
        'demands',
        'all',
        params,
      ],
      detail: (id: string) => [
        ...queryKeys.universities.root,
        'demands',
        'detail',
        id,
      ],
    },
  },
  hr: {
    root: ['hr'],
    profile: (id: string) => [...queryKeys.hr.root, 'profile', id],
    company: (companyId: string) => [
      ...queryKeys.hr.root,
      'company',
      companyId,
    ],
  },
};

export type ErrorResponse = {
  httpCode?: number;
  message: string;
  path?: string;
};

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse;
    return data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
