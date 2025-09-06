// أنواع مشتركة للتطبيق

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
};

export type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';

export type SortDirection = 'asc' | 'desc';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ErrorState = {
  message: string;
  code?: string;
  details?: any;
};
