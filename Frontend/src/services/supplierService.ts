// خدمة الموردين

import { apiClient } from './api';
import type { 
  SupplierDto, 
  CreateSupplierDto, 
  UpdateSupplierDto, 
  SupplierSummary,
  PagedResult 
} from '@/types/supplier';
import type { PaginationParams } from '@/types/common';

export const supplierService = {
  // الحصول على قائمة الموردين مع Pagination
  getSuppliers: async (params?: PaginationParams): Promise<PagedResult<SupplierDto>> => {
    const response = await apiClient.get<PagedResult<SupplierDto>>('/api/suppliers', { params });
    return response.data;
  },

  // الحصول على جميع الموردين (بدون pagination)
  getAllSuppliers: async (): Promise<SupplierDto[]> => {
    const response = await apiClient.get<SupplierDto[]>('/api/suppliers/all');
    return response.data;
  },

  // الحصول على مورد بالمعرف
  getSupplierById: async (id: number): Promise<SupplierDto> => {
    const response = await apiClient.get<SupplierDto>(`/api/suppliers/${id}`);
    return response.data;
  },

  // إنشاء مورد جديد
  createSupplier: async (supplierData: CreateSupplierDto): Promise<SupplierDto> => {
    const response = await apiClient.post<SupplierDto>('/api/suppliers', supplierData);
    return response.data;
  },

  // تحديث مورد
  updateSupplier: async (id: number, supplierData: UpdateSupplierDto): Promise<SupplierDto> => {
    const response = await apiClient.put<SupplierDto>(`/api/suppliers/${id}`, supplierData);
    return response.data;
  },

  // حذف مورد
  deleteSupplier: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/suppliers/${id}`);
  },

  // البحث في الموردين
  searchSuppliers: async (query: string): Promise<SupplierDto[]> => {
    const response = await apiClient.get<SupplierDto[]>(`/api/suppliers/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // تفعيل/إلغاء تفعيل مورد
  toggleSupplierStatus: async (id: number): Promise<SupplierDto> => {
    const response = await apiClient.patch<SupplierDto>(`/api/suppliers/${id}/toggle-status`);
    return response.data;
  },

  // الحصول على ملخص الموردين
  getSuppliersSummary: async (): Promise<SupplierSummary> => {
    const response = await apiClient.get<SupplierSummary>('/api/suppliers/summary');
    return response.data;
  },

  // الحصول على الموردين النشطين فقط
  getActiveSuppliers: async (): Promise<SupplierDto[]> => {
    const response = await apiClient.get<SupplierDto[]>('/api/suppliers/active');
    return response.data;
  },

  // التحقق من إمكانية حذف المورد
  canDeleteSupplier: async (id: number): Promise<{ canDelete: boolean; reason?: string }> => {
    const response = await apiClient.get<{ canDelete: boolean; reason?: string }>(`/api/suppliers/${id}/can-delete`);
    return response.data;
  },
};
