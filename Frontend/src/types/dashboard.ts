// أنواع لوحة التحكم

export interface DashboardSummary {
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  netProfit: number;
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalUsers: number;
  todaySales: number;
  todayPurchases: number;
  todayExpenses: number;
  thisMonthSales: number;
  thisMonthPurchases: number;
  thisMonthExpenses: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  pendingReturns: number;
}

export interface SalesChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface RevenueChartData {
  labels: string[];
  sales: number[];
  purchases: number[];
  expenses: number[];
  profit: number[];
}

export interface TopProductsData {
  productId: number;
  productName: string;
  quantitySold: number;
  revenue: number;
  percentage: number;
}

export interface TopCustomersData {
  customerName: string;
  totalPurchases: number;
  totalAmount: number;
  percentage: number;
}

export interface RecentActivity {
  id: number;
  type: ActivityType;
  description: string;
  userId: number;
  username: string;
  createdAt: string;
  metadata?: any;
}

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  period?: 'today' | 'week' | 'month' | 'year' | 'custom';
}

export enum ActivityType {
  Sale = 'Sale',
  Purchase = 'Purchase',
  Expense = 'Expense',
  Return = 'Return',
  UserLogin = 'UserLogin',
  UserLogout = 'UserLogout',
  ProductCreated = 'ProductCreated',
  ProductUpdated = 'ProductUpdated',
  ProductDeleted = 'ProductDeleted',
  CategoryCreated = 'CategoryCreated',
  CategoryUpdated = 'CategoryUpdated',
  CategoryDeleted = 'CategoryDeleted',
  SupplierCreated = 'SupplierCreated',
  SupplierUpdated = 'SupplierUpdated',
  SupplierDeleted = 'SupplierDeleted'
}
