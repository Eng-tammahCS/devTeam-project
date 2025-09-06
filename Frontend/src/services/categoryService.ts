// خدمة الفئات

import { apiClient } from './api';
import type { 
  CategoryDto, 
  CreateCategoryDto, 
  UpdateCategoryDto, 
  CategorySummary,
  PagedResult 
} from '@/types/category';
import type { PaginationParams } from '@/types/common';

export const categoryService = {
  // الحصول على قائمة الفئات مع Pagination
  getCategories: async (params?: PaginationParams): Promise<PagedResult<CategoryDto>> => {
    const response = await apiClient.get<PagedResult<CategoryDto>>('/api/categories', { params });
    return response.data;
  },

  // الحصول على جميع الفئات (بدون pagination)
  getAllCategories: async (): Promise<CategoryDto[]> => {
    const response = await apiClient.get<CategoryDto[]>('/api/categories/all');
    return response.data;
  },

  // الحصول على فئة بالمعرف
  getCategoryById: async (id: number): Promise<CategoryDto> => {
    const response = await apiClient.get<CategoryDto>(`/api/categories/${id}`);
    return response.data;
  },

  // إنشاء فئة جديدة
  createCategory: async (categoryData: CreateCategoryDto): Promise<CategoryDto> => {
    const response = await apiClient.post<CategoryDto>('/api/categories', categoryData);
    return response.data;
  },

  // تحديث فئة
  updateCategory: async (id: number, categoryData: UpdateCategoryDto): Promise<CategoryDto> => {
    const response = await apiClient.put<CategoryDto>(`/api/categories/${id}`, categoryData);
    return response.data;
  },

  // حذف فئة
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/categories/${id}`);
  },

  // البحث في الفئات
  searchCategories: async (query: string): Promise<CategoryDto[]> => {
    const response = await apiClient.get<CategoryDto[]>(`/api/categories/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // الحصول على ملخص الفئات
  getCategoriesSummary: async (): Promise<CategorySummary> => {
    const response = await apiClient.get<CategorySummary>('/api/categories/summary');
    return response.data;
  },

  // التحقق من إمكانية حذف الفئة
  canDeleteCategory: async (id: number): Promise<{ canDelete: boolean; reason?: string }> => {
    const response = await apiClient.get<{ canDelete: boolean; reason?: string }>(`/api/categories/${id}/can-delete`);
    return response.data;
  },
};
