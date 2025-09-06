// أنواع المبيعات

export interface SalesInvoiceDto {
  id: number;
  invoiceNumber: string;
  customerName?: string;
  invoiceDate: string;
  discountTotal: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  overrideByUserId?: number;
  overrideByUsername?: string;
  overrideDate?: string;
  userId: number;
  username: string;
  createdAt: string;
  details: SalesInvoiceDetailDto[];
}

export interface SalesInvoiceDetailDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
}

export interface CreateSalesInvoiceDto {
  invoiceNumber: string;
  customerName?: string;
  invoiceDate: string;
  discountTotal: number;
  paymentMethod: PaymentMethod;
  details: CreateSalesInvoiceDetailDto[];
}

export interface CreateSalesInvoiceDetailDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
}

export interface SalesSummary {
  totalSales: number;
  totalAmount: number;
  todaySales: number;
  todayAmount: number;
  thisMonthSales: number;
  thisMonthAmount: number;
  averageSaleValue: number;
  topProducts: TopProductDto[];
}

export interface TopProductDto {
  productId: number;
  productName: string;
  quantitySold: number;
  totalAmount: number;
  percentage: number;
}

export interface SalesSearchParams {
  startDate?: string;
  endDate?: string;
  customerName?: string;
  paymentMethod?: PaymentMethod;
  userId?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

export enum PaymentMethod {
  Cash = 'Cash',
  Credit = 'Credit',
  Card = 'Card',
  BankTransfer = 'BankTransfer',
  Check = 'Check'
}
