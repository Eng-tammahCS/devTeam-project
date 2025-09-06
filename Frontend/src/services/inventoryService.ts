// خدمة المخزون

import { apiClient } from './api';
import type { 
  InventoryLogDto, 
  InventorySummary,
  StockAdjustmentDto,
  InventorySearchParams,
  PagedResult 
} from '@/types/inventory';

export const inventoryService = {
  // الحصول على قائمة سجلات المخزون مع Pagination
  getInventoryLogs: async (params?: InventorySearchParams): Promise<PagedResult<InventoryLogDto>> => {
    const response = await apiClient.get<PagedResult<InventoryLogDto>>('/api/inventory/logs', { params });
    return response.data;
  },

  // الحصول على سجل مخزون بالمعرف
  getInventoryLogById: async (id: number): Promise<InventoryLogDto> => {
    const response = await apiClient.get<InventoryLogDto>(`/api/inventory/logs/${id}`);
    return response.data;
  },

  // الحصول على ملخص المخزون
  getInventorySummary: async (): Promise<InventorySummary> => {
    const response = await apiClient.get<InventorySummary>('/api/inventory/summary');
    return response.data;
  },

  // تعديل كمية المخزون
  adjustStock: async (adjustment: StockAdjustmentDto): Promise<InventoryLogDto> => {
    const response = await apiClient.post<InventoryLogDto>('/api/inventory/adjust', adjustment);
    return response.data;
  },

  // الحصول على المنتجات منخفضة المخزون
  getLowStockProducts: async (threshold?: number): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/api/inventory/low-stock${threshold ? `?threshold=${threshold}` : ''}`);
    return response.data;
  },

  // الحصول على المنتجات المنتهية المخزون
  getOutOfStockProducts: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/api/inventory/out-of-stock');
    return response.data;
  },

  // البحث في سجلات المخزون
  searchInventoryLogs: async (query: string): Promise<InventoryLogDto[]> => {
    const response = await apiClient.get<InventoryLogDto[]>(`/api/inventory/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // الحصول على سجلات المخزون حسب المنتج
  getInventoryLogsByProduct: async (productId: number): Promise<InventoryLogDto[]> => {
    const response = await apiClient.get<InventoryLogDto[]>(`/api/inventory/product/${productId}/logs`);
    return response.data;
  },

  // الحصول على سجلات المخزون حسب النوع
  getInventoryLogsByType: async (type: string): Promise<InventoryLogDto[]> => {
    const response = await apiClient.get<InventoryLogDto[]>(`/api/inventory/type/${type}/logs`);
    return response.data;
  },

  // الحصول على سجلات المخزون حسب الفترة
  getInventoryLogsByPeriod: async (startDate: string, endDate: string): Promise<InventoryLogDto[]> => {
    const response = await apiClient.get<InventoryLogDto[]>(`/api/inventory/by-period?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // الحصول على إحصائيات المخزون اليومية
  getDailyInventoryStats: async (date: string): Promise<any> => {
    const response = await apiClient.get<any>(`/api/inventory/daily-stats?date=${date}`);
    return response.data;
  },

  // الحصول على إحصائيات المخزون الشهرية
  getMonthlyInventoryStats: async (year: number, month: number): Promise<any> => {
    const response = await apiClient.get<any>(`/api/inventory/monthly-stats?year=${year}&month=${month}`);
    return response.data;
  },

  // تصدير تقرير المخزون
  exportInventoryReport: async (format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> => {
    const response = await apiClient.get(`/api/inventory/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },
};
