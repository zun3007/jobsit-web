import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/services/jobService';

export function useSavedJobs() {
  const queryClient = useQueryClient();

  const { data: savedJobIds = [], isLoading } = useQuery({
    queryKey: ['savedJobIds'],
    queryFn: jobService.getSavedJobIds,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
  });

  const invalidateSavedJobs = () => {
    queryClient.invalidateQueries({ queryKey: ['savedJobIds'] });
  };

  return {
    savedJobIds,
    isLoading,
    invalidateSavedJobs,
  };
}
