import { useQuery } from '@tanstack/react-query';
import { jobService, JobResponse } from '@/services/jobService';
import { useAppDispatch } from '@/app/store';
import { setJobs } from './jobSlice';

export const useActiveCompanyJobs = (companyId: number) => {
  const dispatch = useAppDispatch();

  const { data: jobsData, isLoading } = useQuery<JobResponse>({
    queryKey: ['activeCompanyJobs', companyId],
    queryFn: async () => {
      const data = await jobService.getActiveJobsByCompany(companyId);
      dispatch(setJobs({ jobs: data.contents, total: data.totalItems }));
      return data;
    },
  });

  return {
    jobs: jobsData?.contents || [],
    totalJobs: jobsData?.totalItems || 0,
    isLoading,
  };
};
