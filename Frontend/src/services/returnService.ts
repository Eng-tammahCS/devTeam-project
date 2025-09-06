// خدمة المرتجعات

import { apiClient } from './api';
import type { 
  ReturnDto, 
  CreateReturnDto, 
  UpdateReturnDto,
  ReturnsSummaryDto,
  ReturnSearchParams,
  PagedResult 
} from '@/types/return';

export const returnService = {
  // الحصول على قائمة المرتجعات مع Pagination
  getReturns: async (params?: ReturnSearchParams): Promise<PagedResult<ReturnDto>> => {
    const response = await apiClient.get<PagedResult<ReturnDto>>('/api/returns', { params });
    return response.data;
  },

  // الحصول على مرتجع بالمعرف
  getReturnById: async (id: number): Promise<ReturnDto> => {
    const response = await apiClient.get<ReturnDto>(`/api/returns/${id}`);
    return response.data;
  },

  // إنشاء مرتجع جديد
  createReturn: async (returnData: CreateReturnDto): Promise<ReturnDto> => {
    const response = await apiClient.post<ReturnDto>('/api/returns', returnData);
    return response.data;
  },

  // تحديث مرتجع
  updateReturn: async (id: number, returnData: UpdateReturnDto): Promise<ReturnDto> => {
    const response = await apiClient.put<ReturnDto>(`/api/returns/${id}`, returnData);
    return response.data;
  },

  // حذف مرتجع
  deleteReturn: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/returns/${id}`);
  },

  // الحصول على ملخص المرتجعات
  getReturnsSummary: async (): Promise<ReturnsSummaryDto> => {
    const response = await apiClient.get<ReturnsSummaryDto>('/api/returns/summary');
    return response.data;
  },

  // البحث في المرتجعات
  searchReturns: async (query: string): Promise<ReturnDto[]> => {
    const response = await apiClient.get<ReturnDto[]>(`/api/returns/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // الحصول على مرتجعات البيع
  getSalesReturns: async (): Promise<ReturnDto[]> => {
    const response = await apiClient.get<ReturnDto[]>('/api/returns/sales');
    return response.data;
  },

  // الحصول على مرتجعات الشراء
  getPurchaseReturns: async (): Promise<ReturnDto[]> => {
    const response = await apiClient.get<ReturnDto[]>('/api/returns/purchases');
    return response.data;
  },

  // الحصول على المرتجعات حسب الحالة
  getReturnsByStatus: async (status: string): Promise<ReturnDto[]> => {
    const response = await apiClient.get<ReturnDto[]>(`/api/returns/by-status?status=${status}`);
    return response.data;
  },

  // الحصول على المرتجعات حسب الفترة
  getReturnsByPeriod: async (startDate: string, endDate: string): Promise<ReturnDto[]> => {
    const response = await apiClient.get<ReturnDto[]>(`/api/returns/by-period?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // الموافقة على مرتجع
  approveReturn: async (id: number): Promise<ReturnDto> => {
    const response = await apiClient.patch<ReturnDto>(`/api/returns/${id}/approve`);
    return response.data;
  },

  // رفض مرتجع
  rejectReturn: async (id: number, reason?: string): Promise<ReturnDto> => {
    const response = await apiClient.patch<ReturnDto>(`/api/returns/${id}/reject`, { reason });
    return response.data;
  },

  // معالجة مرتجع
  processReturn: async (id: number): Promise<ReturnDto> => {
    const response = await apiClient.patch<ReturnDto>(`/api/returns/${id}/process`);
    return response.data;
  },
};
