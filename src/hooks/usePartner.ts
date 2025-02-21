import { useQuery } from '@tanstack/react-query';
import {
  partnerService,
  ProgrammeSearchParams,
} from '@/services/partnerService';
import { queryKeys } from '@/lib/react-query';

export const useInternshipProgrammes = (params: ProgrammeSearchParams) => {
  return useQuery({
    queryKey: queryKeys.partner.programmes(params),
    queryFn: () => partnerService.searchInternshipProgrammes(params),
  });
};
