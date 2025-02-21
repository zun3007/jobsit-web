import { useQuery } from '@tanstack/react-query';
import { hrService } from '@/services/hrService';
import { queryKeys } from '@/lib/react-query';

export const useHR = (id: number) => {
  return useQuery({
    queryKey: queryKeys.hr.profile(id.toString()),
    queryFn: () => hrService.getHR(id),
  });
};

export const useHRByUserId = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.hr.profile(userId.toString()),
    queryFn: () => hrService.getHRByUserId(userId),
  });
};
