import { axiosInstance, handleApiError } from './api';

const FILE_DISPLAY_URL = 'http://localhost:8085/api/file/display';
const MAX_AVATAR_SIZE = 512 * 1024; // 512KB in bytes
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export type FileType = 'avatar' | 'cv' | 'internship-programme';

interface FileValidationError extends Error {
  code: 'FILE_TOO_LARGE' | 'INVALID_FILE_TYPE';
}

export const fileService = {
  /**
   * Get the display URL for a file
   * @param fileName - The name of the file to display
   * @param preview - Optional preview URL for local files
   * @returns The full URL to display the file
   */
  getFileDisplayUrl(
    fileName: string | null | undefined,
    preview?: string
  ): string {
    // If there's a preview URL (for local files), use it
    if (preview) return preview;

    // For existing files from server
    if (fileName) {
      // If it's already a full URL, return it
      if (fileName.startsWith('http')) return fileName;
      // If it's just a filename, construct the full URL
      return `${FILE_DISPLAY_URL}/${fileName}`;
    }

    // Default fallback
    return '/default-avatar.svg';
  },

  /**
   * Extract file name from a full URL
   * @param url - The full URL containing the file name
   * @returns The extracted file name or null if URL is invalid
   */
  getFileNameFromUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    const parts = url.split('/');
    return parts[parts.length - 1];
  },

  /**
   * Validate avatar file
   * @param file - The avatar file to validate
   * @throws {FileValidationError} If file is invalid
   */
  validateAvatarFile(file: File): void {
    if (file.size > MAX_AVATAR_SIZE) {
      const error = new Error(
        'Avatar file size must be less than 512KB'
      ) as FileValidationError;
      error.code = 'FILE_TOO_LARGE';
      throw error;
    }
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      const error = new Error(
        'Avatar must be a JPG or PNG file'
      ) as FileValidationError;
      error.code = 'INVALID_FILE_TYPE';
      throw error;
    }
  },

  /**
   * Validate CV file
   * @param file - The CV file to validate
   * @throws {FileValidationError} If file is invalid
   */
  validateCVFile(file: File): void {
    if (!ALLOWED_CV_TYPES.includes(file.type)) {
      const error = new Error(
        'CV must be a PDF, DOC, or DOCX file'
      ) as FileValidationError;
      error.code = 'INVALID_FILE_TYPE';
      throw error;
    }
  },

  /**
   * Upload a file with validation
   * @param file - The file to upload
   * @param type - The type of file ('avatar' or 'cv')
   * @returns The response from the server
   * @throws {FileValidationError} If file validation fails
   */
  async uploadFile(file: File, type: 'avatar' | 'cv'): Promise<string> {
    try {
      // Validate file based on type
      if (type === 'avatar') {
        this.validateAvatarFile(file);
      } else if (type === 'cv') {
        this.validateCVFile(file);
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post<{ url: string }>(
        `/file/upload/${type}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.url;
    } catch (error) {
      if ((error as FileValidationError).code) {
        throw error;
      }
      return handleApiError(error);
    }
  },

  /**
   * Delete a file
   * @param fileName - The name of the file to delete
   * @returns A promise that resolves when the file is deleted
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      await axiosInstance.delete(`/file/${fileName}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Download a file
   * @param fileName - The name of the file to download
   * @returns The file blob
   */
  async downloadFile(fileName: string): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`/file/download/${fileName}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
