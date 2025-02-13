import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/app/store';
import {
  candidateService,
  UpdateCandidateRequest,
} from '@/services/candidateService';
import { queryKeys } from '@/lib/react-query';
import {
  setProfile,
  updateProfile,
  setError,
} from '@/features/candidates/candidateSlice';
import { extractErrorMessage } from '@/services/api';
import { jobService } from '@/services/jobService';
import { applicationService } from '@/services/applicationService';

export function useCandidates() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // Get candidate profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: queryKeys.candidates.profile('me'),
    queryFn: candidateService.getProfile,
    enabled: !!localStorage.getItem('token'),
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

  return {
    profile,
    applications: applications?.contents || [],
    totalApplications: applications?.totalElements || 0,
    recommendedJobs: recommendedJobs?.contents || [],
    isLoadingProfile,
    isLoadingApplications,
    isLoadingRecommendedJobs,
    applicationsError,
    recommendedJobsError,
    updateProfile: updateProfileMutation.mutate,
    applyForJob: applyForJobMutation.mutate,
    withdrawApplication: withdrawApplicationMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    isApplying: applyForJobMutation.isPending,
    isWithdrawing: withdrawApplicationMutation.isPending,
  };
}
