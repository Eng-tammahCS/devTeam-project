// أنواع المرتجعات

export interface ReturnDto {
  id: number;
  returnNumber: string;
  type: ReturnType;
  referenceId: number;
  productId: number;
  productName: string;
  quantity: number;
  reason: string;
  status: ReturnStatus;
  createdBy: number;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReturnDto {
  type: ReturnType;
  referenceId: number;
  productId: number;
  quantity: number;
  reason: string;
}

export interface UpdateReturnDto {
  id: number;
  reason: string;
  status: ReturnStatus;
}

export interface ReturnsSummaryDto {
  totalReturns: number;
  salesReturns: number;
  purchaseReturns: number;
  pendingReturns: number;
  approvedReturns: number;
  rejectedReturns: number;
  totalValue: number;
  topReasons: TopReturnReasonDto[];
}

export interface TopReturnReasonDto {
  reason: string;
  count: number;
  percentage: number;
}

export interface ReturnSearchParams {
  type?: ReturnType;
  status?: ReturnStatus;
  startDate?: string;
  endDate?: string;
  productId?: number;
  createdBy?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

export enum ReturnType {
  Sales = 'Sales',
  Purchase = 'Purchase'
}

export enum ReturnStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Processed = 'Processed'
}
