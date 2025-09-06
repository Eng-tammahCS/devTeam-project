// خدمة المشتريات

import { apiClient } from './api';
import type { 
  PurchaseInvoiceDto, 
  CreatePurchaseInvoiceDto, 
  PurchaseSummary,
  PurchaseSearchParams,
  TopSupplierDto,
  PagedResult 
} from '@/types/purchase';

export const purchaseService = {
  // الحصول على قائمة فواتير الشراء مع Pagination
  getPurchaseInvoices: async (params?: PurchaseSearchParams): Promise<PagedResult<PurchaseInvoiceDto>> => {
    const response = await apiClient.get<PagedResult<PurchaseInvoiceDto>>('/api/purchase-invoices', { params });
    return response.data;
  },

  // الحصول على فاتورة شراء بالمعرف
  getPurchaseInvoiceById: async (id: number): Promise<PurchaseInvoiceDto> => {
    const response = await apiClient.get<PurchaseInvoiceDto>(`/api/purchase-invoices/${id}`);
    return response.data;
  },

  // إنشاء فاتورة شراء جديدة
  createPurchaseInvoice: async (invoiceData: CreatePurchaseInvoiceDto): Promise<PurchaseInvoiceDto> => {
    const response = await apiClient.post<PurchaseInvoiceDto>('/api/purchase-invoices', invoiceData);
    return response.data;
  },

  // تحديث فاتورة شراء
  updatePurchaseInvoice: async (id: number, invoiceData: Partial<CreatePurchaseInvoiceDto>): Promise<PurchaseInvoiceDto> => {
    const response = await apiClient.put<PurchaseInvoiceDto>(`/api/purchase-invoices/${id}`, invoiceData);
    return response.data;
  },

  // حذف فاتورة شراء
  deletePurchaseInvoice: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/purchase-invoices/${id}`);
  },

  // الحصول على ملخص المشتريات
  getPurchaseSummary: async (): Promise<PurchaseSummary> => {
    const response = await apiClient.get<PurchaseSummary>('/api/purchase-invoices/summary');
    return response.data;
  },

  // الحصول على أفضل الموردين
  getTopSuppliers: async (limit?: number): Promise<TopSupplierDto[]> => {
    const response = await apiClient.get<TopSupplierDto[]>(`/api/purchase-invoices/top-suppliers${limit ? `?limit=${limit}` : ''}`);
    return response.data;
  },

  // الحصول على إحصائيات المشتريات حسب الفترة
  getPurchasesByPeriod: async (startDate: string, endDate: string): Promise<PurchaseInvoiceDto[]> => {
    const response = await apiClient.get<PurchaseInvoiceDto[]>(`/api/purchase-invoices/by-period?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // طباعة فاتورة شراء
  printPurchaseInvoice: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/api/purchase-invoices/${id}/print`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // إلغاء فاتورة شراء
  cancelPurchaseInvoice: async (id: number, reason?: string): Promise<PurchaseInvoiceDto> => {
    const response = await apiClient.patch<PurchaseInvoiceDto>(`/api/purchase-invoices/${id}/cancel`, { reason });
    return response.data;
  },

  // استرداد فاتورة شراء ملغاة
  restorePurchaseInvoice: async (id: number): Promise<PurchaseInvoiceDto> => {
    const response = await apiClient.patch<PurchaseInvoiceDto>(`/api/purchase-invoices/${id}/restore`);
    return response.data;
  },
};
