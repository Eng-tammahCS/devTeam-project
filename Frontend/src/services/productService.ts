// خدمة المنتجات

import { apiClient } from './api';
import type { 
  ProductDto, 
  CreateProductDto, 
  UpdateProductDto, 
  ProductSearchParams,
  ProductSummary,
  PagedResult 
} from '@/types/product';

export const productService = {
  // الحصول على قائمة المنتجات مع Pagination
  getProducts: async (params?: ProductSearchParams): Promise<PagedResult<ProductDto>> => {
    const response = await apiClient.get<PagedResult<ProductDto>>('/api/products', { params });
    return response.data;
  },

  // الحصول على منتج بالمعرف
  getProductById: async (id: number): Promise<ProductDto> => {
    const response = await apiClient.get<ProductDto>(`/api/products/${id}`);
    return response.data;
  },

  // إنشاء منتج جديد
  createProduct: async (productData: CreateProductDto): Promise<ProductDto> => {
    const response = await apiClient.post<ProductDto>('/api/products', productData);
    return response.data;
  },

  // تحديث منتج
  updateProduct: async (id: number, productData: UpdateProductDto): Promise<ProductDto> => {
    const response = await apiClient.put<ProductDto>(`/api/products/${id}`, productData);
    return response.data;
  },

  // حذف منتج
  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`);
  },

  // البحث في المنتجات
  searchProducts: async (query: string): Promise<ProductDto[]> => {
    const response = await apiClient.get<ProductDto[]>(`/api/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // الحصول على المنتجات حسب الفئة
  getProductsByCategory: async (categoryId: number): Promise<ProductDto[]> => {
    const response = await apiClient.get<ProductDto[]>(`/api/products/category/${categoryId}`);
    return response.data;
  },

  // الحصول على المنتجات حسب المورد
  getProductsBySupplier: async (supplierId: number): Promise<ProductDto[]> => {
    const response = await apiClient.get<ProductDto[]>(`/api/products/supplier/${supplierId}`);
    return response.data;
  },

  // الحصول على المنتجات منخفضة المخزون
  getLowStockProducts: async (threshold?: number): Promise<ProductDto[]> => {
    const response = await apiClient.get<ProductDto[]>(`/api/products/low-stock${threshold ? `?threshold=${threshold}` : ''}`);
    return response.data;
  },

  // الحصول على المنتجات المنتهية المخزون
  getOutOfStockProducts: async (): Promise<ProductDto[]> => {
    const response = await apiClient.get<ProductDto[]>('/api/products/out-of-stock');
    return response.data;
  },

  // الحصول على ملخص المنتجات
  getProductsSummary: async (): Promise<ProductSummary> => {
    const response = await apiClient.get<ProductSummary>('/api/products/summary');
    return response.data;
  },

  // تحديث كمية المخزون
  updateStock: async (id: number, quantity: number, reason?: string): Promise<ProductDto> => {
    const response = await apiClient.patch<ProductDto>(`/api/products/${id}/stock`, {
      quantity,
      reason
    });
    return response.data;
  },

  // رفع صورة المنتج
  uploadProductImage: async (id: number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<{ imageUrl: string }>(`/api/products/${id}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrl;
  },

  // حذف صورة المنتج
  deleteProductImage: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/products/${id}/image`);
  },
};
