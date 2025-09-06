// أنواع المنتجات

export interface ProductDto {
  id: number;
  name: string;
  barcode?: string;
  categoryId: number;
  categoryName: string;
  supplierId?: number;
  supplierName?: string;
  defaultCostPrice: number;
  defaultSellingPrice: number;
  minSellingPrice: number;
  description?: string;
  createdAt: string;
  currentQuantity: number;
}

export interface CreateProductDto {
  name: string;
  barcode?: string;
  categoryId: number;
  supplierId?: number;
  defaultCostPrice: number;
  defaultSellingPrice: number;
  minSellingPrice: number;
  description?: string;
}

export interface UpdateProductDto {
  id: number;
  name: string;
  barcode?: string;
  categoryId: number;
  supplierId?: number;
  defaultCostPrice: number;
  defaultSellingPrice: number;
  minSellingPrice: number;
  description?: string;
}

export interface ProductSearchParams {
  search?: string;
  categoryId?: number;
  supplierId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ProductSummary {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalValue: number;
  categoryDistribution: CategoryDistribution[];
}

export interface CategoryDistribution {
  categoryName: string;
  productCount: number;
  percentage: number;
}
