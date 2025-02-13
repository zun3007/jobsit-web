import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { universityService } from '@/services/universityService';
import { queryKeys } from '@/lib/react-query';
import {
  setUniversities,
  setSelectedUniversity,
  updateUniversity,
  setError,
  setTypes,
  setMajors,
} from '@/features/universities/universitySlice';
import { extractErrorMessage } from '@/services/api';

export function useUniversities() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const filters = useAppSelector((state) => state.universities.filters);

  // Get universities with filters
  const { data: universitiesData, isLoading } = useQuery({
    queryKey: queryKeys.universities.all(filters),
    queryFn: () => universityService.getUniversities(filters),
    onSuccess: (data) => {
      dispatch(
        setUniversities({
          universities: data.content,
          total: data.totalElements,
        })
      );
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Get university details
  const getUniversityDetails = useMutation({
    mutationFn: (id: number) => universityService.getUniversity(id),
    onSuccess: (data) => {
      dispatch(setSelectedUniversity(data));
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Update university mutation
  const updateUniversityMutation = useMutation({
    mutationFn: (data: FormData) => universityService.updateUniversity(data),
    onSuccess: (data) => {
      dispatch(updateUniversity(data));
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.root });
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Get university demands
  const getUniversityDemands = useMutation({
    mutationFn: (universityId: number) =>
      universityService.getDemands(universityId),
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Create demand mutation
  const createDemandMutation = useMutation({
    mutationFn: ({ universityId, data }: { universityId: number; data: any }) =>
      universityService.createDemand(universityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.root });
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Update demand mutation
  const updateDemandMutation = useMutation({
    mutationFn: ({
      universityId,
      demandId,
      data,
    }: {
      universityId: number;
      demandId: number;
      data: any;
    }) => universityService.updateDemand(universityId, demandId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.root });
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Delete demand mutation
  const deleteDemandMutation = useMutation({
    mutationFn: ({
      universityId,
      demandId,
    }: {
      universityId: number;
      demandId: number;
    }) => universityService.deleteDemand(universityId, demandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.universities.root });
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  return {
    universities: universitiesData?.content || [],
    totalUniversities: universitiesData?.totalElements || 0,
    isLoading,
    getUniversityDetails: getUniversityDetails.mutate,
    updateUniversity: updateUniversityMutation.mutate,
    getDemands: getUniversityDemands.mutate,
    createDemand: createDemandMutation.mutate,
    updateDemand: updateDemandMutation.mutate,
    deleteDemand: deleteDemandMutation.mutate,
    isUpdating: updateUniversityMutation.isPending,
    isCreatingDemand: createDemandMutation.isPending,
    isUpdatingDemand: updateDemandMutation.isPending,
    isDeletingDemand: deleteDemandMutation.isPending,
  };
}
