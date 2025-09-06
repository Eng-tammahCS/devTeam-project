// أنواع المخزون

export interface InventoryLogDto {
  id: number;
  productId: number;
  productName: string;
  type: InventoryLogType;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: number;
  notes?: string;
  createdBy: number;
  createdByUsername: string;
  createdAt: string;
}

export interface InventorySummary {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalValue: number;
  categoryDistribution: CategoryDistribution[];
  recentMovements: InventoryLogDto[];
}

export interface CategoryDistribution {
  categoryName: string;
  productCount: number;
  percentage: number;
}

export interface StockAdjustmentDto {
  productId: number;
  quantity: number;
  reason: string;
  notes?: string;
}

export interface InventorySearchParams {
  productId?: number;
  type?: InventoryLogType;
  startDate?: string;
  endDate?: string;
  createdBy?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

export enum InventoryLogType {
  Purchase = 'Purchase',
  Sale = 'Sale',
  Adjustment = 'Adjustment',
  Return = 'Return',
  Transfer = 'Transfer',
  Loss = 'Loss'
}
