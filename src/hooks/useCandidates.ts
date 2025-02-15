import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  candidateService,
  UpdateCandidateRequest,
} from '@/services/candidateService';
import { queryKeys } from '@/lib/react-query';
import { updateProfile, setError } from '@/features/candidates/candidateSlice';
import { extractErrorMessage } from '@/services/api';
import { jobService } from '@/services/jobService';
import { applicationService } from '@/services/applicationService';

export function useCandidates() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  // Get candidate profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: queryKeys.candidates.profile(user?.id?.toString() || ''),
    queryFn: () => (user?.id ? candidateService.getProfile(user.id) : null),
    enabled: !!user?.id && !!localStorage.getItem('token'),
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateCandidateRequest) =>
      candidateService.updateProfile(data),
    onSuccess: (data) => {
      dispatch(updateProfile(data));
      queryClient.invalidateQueries({ queryKey: queryKeys.candidates.root });
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Get applications query
  const {
    data: applications,
    isLoading: isLoadingApplications,
    error: applicationsError,
  } = useQuery({
    queryKey: ['candidate-applications'],
    queryFn: () => applicationService.getCandidateApplications(),
  });

  // Apply for job mutation
  const applyForJobMutation = useMutation({
    mutationFn: candidateService.applyForJob,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.candidates.applications(),
      });
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Withdraw application mutation
  const withdrawApplicationMutation = useMutation({
    mutationFn: candidateService.withdrawApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.candidates.applications(),
      });
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Get recommended jobs query
  const {
    data: recommendedJobs,
    isLoading: isLoadingRecommendedJobs,
    error: recommendedJobsError,
  } = useQuery({
    queryKey: ['recommended-jobs'],
    queryFn: () => jobService.getRecommendedJobs(),
  });

  // Update searchable status mutation
  const updateSearchableStatusMutation = useMutation({
    mutationFn: () =>
      user?.id
        ? candidateService.updateSearchableStatus(user.id)
        : Promise.reject('No user ID'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidates.root });
    },
    onError: (error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  return {
    profile,
    applications: applications?.contents || [],
    totalApplications: applications?.totalItems || 0,
    recommendedJobs: recommendedJobs?.contents || [],
    isLoadingProfile,
    isLoadingApplications,
    isLoadingRecommendedJobs,
    applicationsError,
    recommendedJobsError,
    updateProfile: updateProfileMutation.mutateAsync,
    applyForJob: applyForJobMutation.mutate,
    withdrawApplication: withdrawApplicationMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    isApplying: applyForJobMutation.isPending,
    isWithdrawing: withdrawApplicationMutation.isPending,
    updateSearchableStatus: updateSearchableStatusMutation.mutateAsync,
    isUpdatingSearchableStatus: updateSearchableStatusMutation.isPending,
  };
}
