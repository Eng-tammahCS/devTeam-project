// خدمة المبيعات

import { apiClient } from './api';
import type { 
  SalesInvoiceDto, 
  CreateSalesInvoiceDto, 
  SalesSummary,
  SalesSearchParams,
  TopProductsData,
  TopCustomersData,
  PagedResult 
} from '@/types/sales';

export const salesService = {
  // الحصول على قائمة فواتير البيع مع Pagination
  getSalesInvoices: async (params?: SalesSearchParams): Promise<PagedResult<SalesInvoiceDto>> => {
    const response = await apiClient.get<PagedResult<SalesInvoiceDto>>('/api/sales-invoices', { params });
    return response.data;
  },

  // الحصول على فاتورة بيع بالمعرف
  getSalesInvoiceById: async (id: number): Promise<SalesInvoiceDto> => {
    const response = await apiClient.get<SalesInvoiceDto>(`/api/sales-invoices/${id}`);
    return response.data;
  },

  // إنشاء فاتورة بيع جديدة
  createSalesInvoice: async (invoiceData: CreateSalesInvoiceDto): Promise<SalesInvoiceDto> => {
    const response = await apiClient.post<SalesInvoiceDto>('/api/sales-invoices', invoiceData);
    return response.data;
  },

  // تحديث فاتورة بيع
  updateSalesInvoice: async (id: number, invoiceData: Partial<CreateSalesInvoiceDto>): Promise<SalesInvoiceDto> => {
    const response = await apiClient.put<SalesInvoiceDto>(`/api/sales-invoices/${id}`, invoiceData);
    return response.data;
  },

  // حذف فاتورة بيع
  deleteSalesInvoice: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/sales-invoices/${id}`);
  },

  // الحصول على ملخص المبيعات
  getSalesSummary: async (): Promise<SalesSummary> => {
    const response = await apiClient.get<SalesSummary>('/api/sales-invoices/summary');
    return response.data;
  },

  // الحصول على أفضل المنتجات مبيعاً
  getTopProducts: async (limit?: number): Promise<TopProductsData[]> => {
    const response = await apiClient.get<TopProductsData[]>(`/api/sales-invoices/top-products${limit ? `?limit=${limit}` : ''}`);
    return response.data;
  },

  // الحصول على أفضل العملاء
  getTopCustomers: async (limit?: number): Promise<TopCustomersData[]> => {
    const response = await apiClient.get<TopCustomersData[]>(`/api/sales-invoices/top-customers${limit ? `?limit=${limit}` : ''}`);
    return response.data;
  },

  // الحصول على إحصائيات المبيعات حسب الفترة
  getSalesByPeriod: async (startDate: string, endDate: string): Promise<SalesInvoiceDto[]> => {
    const response = await apiClient.get<SalesInvoiceDto[]>(`/api/sales-invoices/by-period?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // طباعة فاتورة بيع
  printSalesInvoice: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/api/sales-invoices/${id}/print`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // إلغاء فاتورة بيع
  cancelSalesInvoice: async (id: number, reason?: string): Promise<SalesInvoiceDto> => {
    const response = await apiClient.patch<SalesInvoiceDto>(`/api/sales-invoices/${id}/cancel`, { reason });
    return response.data;
  },

  // استرداد فاتورة بيع ملغاة
  restoreSalesInvoice: async (id: number): Promise<SalesInvoiceDto> => {
    const response = await apiClient.patch<SalesInvoiceDto>(`/api/sales-invoices/${id}/restore`);
    return response.data;
  },
};
