// خدمة المستخدمين

import { apiClient } from './api';
import type { 
  UserDto, 
  CreateUserDto, 
  UpdateUserDto, 
  UsersSummaryDto,
  PagedResult 
} from '@/types/auth';
import type { PaginationParams } from '@/types/common';

export const userService = {
  // الحصول على قائمة المستخدمين مع Pagination
  getUsers: async (params?: PaginationParams): Promise<PagedResult<UserDto>> => {
    const response = await apiClient.get<PagedResult<UserDto>>('/api/users', { params });
    return response.data;
  },

  // الحصول على مستخدم بالمعرف
  getUserById: async (id: number): Promise<UserDto> => {
    const response = await apiClient.get<UserDto>(`/api/users/${id}`);
    return response.data;
  },

  // إنشاء مستخدم جديد
  createUser: async (userData: CreateUserDto): Promise<UserDto> => {
    const response = await apiClient.post<UserDto>('/api/users', userData);
    return response.data;
  },

  // تحديث مستخدم
  updateUser: async (id: number, userData: UpdateUserDto): Promise<UserDto> => {
    const response = await apiClient.put<UserDto>(`/api/users/${id}`, userData);
    return response.data;
  },

  // حذف مستخدم
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/users/${id}`);
  },

  // تفعيل/إلغاء تفعيل مستخدم
  toggleUserStatus: async (id: number): Promise<UserDto> => {
    const response = await apiClient.patch<UserDto>(`/api/users/${id}/toggle-status`);
    return response.data;
  },

  // الحصول على ملخص المستخدمين
  getUsersSummary: async (): Promise<UsersSummaryDto> => {
    const response = await apiClient.get<UsersSummaryDto>('/api/users/summary');
    return response.data;
  },

  // البحث في المستخدمين
  searchUsers: async (query: string): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>(`/api/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // رفع صورة المستخدم
  uploadUserImage: async (id: number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<{ imageUrl: string }>(`/api/users/${id}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrl;
  },

  // حذف صورة المستخدم
  deleteUserImage: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/users/${id}/image`);
  },
};
