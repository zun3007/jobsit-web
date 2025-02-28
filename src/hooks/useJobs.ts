import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  jobService,
  CreateJobRequest,
  UpdateJobRequest,
} from '@/services/jobService';
import { queryKeys } from '@/lib/react-query';
import {
  setJobs,
  setError,
  addJob,
  updateJob,
  removeJob,
} from '@/features/jobs/jobSlice';
import { extractErrorMessage } from '@/services/api';

export function useJobs() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const filters = useAppSelector((state) => state.jobs.filters);

  // Fetch jobs with filters
  const { data: jobsData, isLoading } = useQuery({
    queryKey: queryKeys.jobs.all(filters),
    queryFn: async () => {
      const response = await jobService.getJobs(filters);
      dispatch(
        setJobs({ jobs: response.contents, total: response.totalItems })
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (data: CreateJobRequest) => {
      const response = await jobService.createJob(data);
      dispatch(addJob(response));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.root });
    },
    onError: (error: Error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateJobRequest;
    }) => {
      const response = await jobService.updateJob(id, data);
      dispatch(updateJob(response));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.root });
    },
    onError: (error: Error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (id: number) => {
      await jobService.deleteJob(id);
      dispatch(removeJob(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.root });
    },
    onError: (error: Error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  // Duplicate job mutation
  const duplicateJobMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await jobService.duplicateJob(id);
      dispatch(addJob(response));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.root });
    },
    onError: (error: Error) => {
      dispatch(setError(extractErrorMessage(error)));
    },
  });

  return {
    jobs: jobsData?.contents ?? [],
    totalJobs: jobsData?.totalItems ?? 0,
    isLoading,
    createJob: createJobMutation.mutate,
    updateJob: updateJobMutation.mutate,
    deleteJob: deleteJobMutation.mutate,
    duplicateJob: duplicateJobMutation.mutate,
    isCreating: createJobMutation.isPending,
    isUpdating: updateJobMutation.isPending,
    isDeleting: deleteJobMutation.isPending,
    isDuplicating: duplicateJobMutation.isPending,
  };
}
