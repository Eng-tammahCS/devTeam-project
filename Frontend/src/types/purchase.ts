// أنواع المشتريات

export interface PurchaseInvoiceDto {
  id: number;
  invoiceNumber: string;
  supplierId: number;
  supplierName: string;
  invoiceDate: string;
  userId: number;
  username: string;
  totalAmount: number;
  createdAt: string;
  details: PurchaseInvoiceDetailDto[];
}

export interface PurchaseInvoiceDetailDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
}

export interface CreatePurchaseInvoiceDto {
  invoiceNumber: string;
  supplierId: number;
  invoiceDate: string;
  details: CreatePurchaseInvoiceDetailDto[];
}

export interface CreatePurchaseInvoiceDetailDto {
  productId: number;
  quantity: number;
  unitCost: number;
}

export interface PurchaseSummary {
  totalPurchases: number;
  totalAmount: number;
  todayPurchases: number;
  todayAmount: number;
  thisMonthPurchases: number;
  thisMonthAmount: number;
  averagePurchaseValue: number;
  topSuppliers: TopSupplierDto[];
}

export interface TopSupplierDto {
  supplierId: number;
  supplierName: string;
  purchaseCount: number;
  totalAmount: number;
  percentage: number;
}

export interface PurchaseSearchParams {
  startDate?: string;
  endDate?: string;
  supplierId?: number;
  userId?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}
