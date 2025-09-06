// خدمة لوحة التحكم

import { apiClient } from './api';
import type { 
  DashboardSummary,
  SalesChartData,
  RevenueChartData,
  TopProductsData,
  TopCustomersData,
  RecentActivity,
  DashboardFilters 
} from '@/types/dashboard';

export const dashboardService = {
  // الحصول على ملخص لوحة التحكم
  getDashboardSummary: async (filters?: DashboardFilters): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummary>('/api/dashboard/summary', { params: filters });
    return response.data;
  },

  // الحصول على بيانات الرسم البياني للمبيعات
  getSalesChartData: async (filters?: DashboardFilters): Promise<SalesChartData> => {
    const response = await apiClient.get<SalesChartData>('/api/dashboard/sales-chart', { params: filters });
    return response.data;
  },

  // الحصول على بيانات الرسم البياني للإيرادات
  getRevenueChartData: async (filters?: DashboardFilters): Promise<RevenueChartData> => {
    const response = await apiClient.get<RevenueChartData>('/api/dashboard/revenue-chart', { params: filters });
    return response.data;
  },

  // الحصول على أفضل المنتجات
  getTopProducts: async (limit?: number, filters?: DashboardFilters): Promise<TopProductsData[]> => {
    const response = await apiClient.get<TopProductsData[]>(`/api/dashboard/top-products${limit ? `?limit=${limit}` : ''}`, { params: filters });
    return response.data;
  },

  // الحصول على أفضل العملاء
  getTopCustomers: async (limit?: number, filters?: DashboardFilters): Promise<TopCustomersData[]> => {
    const response = await apiClient.get<TopCustomersData[]>(`/api/dashboard/top-customers${limit ? `?limit=${limit}` : ''}`, { params: filters });
    return response.data;
  },

  // الحصول على الأنشطة الحديثة
  getRecentActivities: async (limit?: number): Promise<RecentActivity[]> => {
    const response = await apiClient.get<RecentActivity[]>(`/api/dashboard/recent-activities${limit ? `?limit=${limit}` : ''}`);
    return response.data;
  },

  // الحصول على إحصائيات المبيعات اليومية
  getDailySalesStats: async (date: string): Promise<any> => {
    const response = await apiClient.get<any>(`/api/dashboard/daily-sales?date=${date}`);
    return response.data;
  },

  // الحصول على إحصائيات المبيعات الشهرية
  getMonthlySalesStats: async (year: number, month: number): Promise<any> => {
    const response = await apiClient.get<any>(`/api/dashboard/monthly-sales?year=${year}&month=${month}`);
    return response.data;
  },

  // الحصول على إحصائيات المبيعات السنوية
  getYearlySalesStats: async (year: number): Promise<any> => {
    const response = await apiClient.get<any>(`/api/dashboard/yearly-sales?year=${year}`);
    return response.data;
  },

  // الحصول على إحصائيات المخزون
  getInventoryStats: async (): Promise<any> => {
    const response = await apiClient.get<any>('/api/dashboard/inventory-stats');
    return response.data;
  },

  // الحصول على إحصائيات الموردين
  getSuppliersStats: async (): Promise<any> => {
    const response = await apiClient.get<any>('/api/dashboard/suppliers-stats');
    return response.data;
  },

  // الحصول على إحصائيات المستخدمين
  getUsersStats: async (): Promise<any> => {
    const response = await apiClient.get<any>('/api/dashboard/users-stats');
    return response.data;
  },

  // تصدير تقرير لوحة التحكم
  exportDashboardReport: async (format: 'pdf' | 'excel' = 'pdf', filters?: DashboardFilters): Promise<Blob> => {
    const response = await apiClient.get(`/api/dashboard/export?format=${format}`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },
};
