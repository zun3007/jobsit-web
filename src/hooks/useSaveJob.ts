import { useState } from 'react';
import { useToast } from './useToast';
import { jobService } from '@/services/jobService';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

export const useSaveJob = () => {
  const { showSuccess, showError } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const saveJob = async (jobId: number) => {
    try {
      setIsSaving(true);
      await jobService.saveJob(jobId);
      // Invalidate both saved jobs and saved job IDs queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.saved() }),
        queryClient.invalidateQueries({ queryKey: ['savedJobIds'] }),
      ]);
      showSuccess('Đã lưu công việc thành công');
    } catch (error) {
      showError('Không thể lưu công việc. Vui lòng thử lại sau.');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const unsaveJob = async (jobId: number) => {
    try {
      setIsSaving(true);
      await jobService.unsaveJob(jobId);
      // Invalidate both saved jobs and saved job IDs queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.saved() }),
        queryClient.invalidateQueries({ queryKey: ['savedJobIds'] }),
      ]);
      showSuccess('Đã bỏ lưu công việc');
    } catch (error) {
      showError('Không thể bỏ lưu công việc. Vui lòng thử lại sau.');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveJob,
    unsaveJob,
    isSaving,
  };
};
