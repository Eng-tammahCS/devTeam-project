// أنواع المصروفات

export interface ExpenseDto {
  id: number;
  expenseType: string;
  amount: number;
  note?: string;
  userId: number;
  username: string;
  createdAt: string;
}

export interface CreateExpenseDto {
  expenseType: string;
  amount: number;
  note?: string;
}

export interface UpdateExpenseDto {
  expenseType: string;
  amount: number;
  note?: string;
}

export interface ExpensesSummaryDto {
  totalExpenses: number;
  totalAmount: number;
  todayExpenses: number;
  todayAmount: number;
  thisMonthExpenses: number;
  thisMonthAmount: number;
  averageDailyExpense: number;
  topExpenseTypes: TopExpenseTypeDto[];
}

export interface TopExpenseTypeDto {
  expenseType: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface ExpenseSearchParams {
  startDate?: string;
  endDate?: string;
  expenseType?: string;
  userId?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}
