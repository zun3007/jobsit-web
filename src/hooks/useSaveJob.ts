import { useState } from 'react';
import { useToast } from './useToast';
import { jobService } from '@/services/jobService';
import { useSavedJobs } from './useSavedJobs';

export const useSaveJob = () => {
  const { showSuccess, showError } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { invalidateSavedJobs } = useSavedJobs();

  const saveJob = async (jobId: number) => {
    try {
      setIsSaving(true);
      await jobService.saveJob(jobId);
      await invalidateSavedJobs();
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
      await invalidateSavedJobs();
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
