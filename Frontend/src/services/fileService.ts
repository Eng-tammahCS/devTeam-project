// خدمة رفع الملفات

import { apiClient } from './api';

export const fileService = {
  // رفع ملف عام
  uploadFile: async (file: File, folder?: string): Promise<{ url: string; fileName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }
    
    const response = await apiClient.post<{ url: string; fileName: string }>('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // رفع صورة
  uploadImage: async (file: File, folder?: string): Promise<{ url: string; fileName: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    if (folder) {
      formData.append('folder', folder);
    }
    
    const response = await apiClient.post<{ url: string; fileName: string }>('/api/files/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // رفع ملفات متعددة
  uploadMultipleFiles: async (files: File[], folder?: string): Promise<{ urls: string[]; fileNames: string[] }> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    if (folder) {
      formData.append('folder', folder);
    }
    
    const response = await apiClient.post<{ urls: string[]; fileNames: string[] }>('/api/files/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // حذف ملف
  deleteFile: async (fileName: string): Promise<void> => {
    await apiClient.delete(`/api/files/${encodeURIComponent(fileName)}`);
  },

  // الحصول على قائمة الملفات
  getFiles: async (folder?: string): Promise<{ fileName: string; url: string; size: number; uploadedAt: string }[]> => {
    const response = await apiClient.get<{ fileName: string; url: string; size: number; uploadedAt: string }[]>('/api/files', {
      params: { folder }
    });
    return response.data;
  },

  // تحميل ملف
  downloadFile: async (fileName: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/files/download/${encodeURIComponent(fileName)}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // الحصول على معلومات الملف
  getFileInfo: async (fileName: string): Promise<{ fileName: string; url: string; size: number; uploadedAt: string; mimeType: string }> => {
    const response = await apiClient.get<{ fileName: string; url: string; size: number; uploadedAt: string; mimeType: string }>(`/api/files/info/${encodeURIComponent(fileName)}`);
    return response.data;
  },
};
