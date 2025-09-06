// خدمة المصروفات

import { apiClient } from './api';
import type { 
  ExpenseDto, 
  CreateExpenseDto, 
  UpdateExpenseDto,
  ExpensesSummaryDto,
  ExpenseSearchParams,
  PagedResult 
} from '@/types/expense';

export const expenseService = {
  // الحصول على قائمة المصروفات مع Pagination
  getExpenses: async (params?: ExpenseSearchParams): Promise<PagedResult<ExpenseDto>> => {
    const response = await apiClient.get<PagedResult<ExpenseDto>>('/api/expenses', { params });
    return response.data;
  },

  // الحصول على مصروف بالمعرف
  getExpenseById: async (id: number): Promise<ExpenseDto> => {
    const response = await apiClient.get<ExpenseDto>(`/api/expenses/${id}`);
    return response.data;
  },

  // إنشاء مصروف جديد
  createExpense: async (expenseData: CreateExpenseDto): Promise<ExpenseDto> => {
    const response = await apiClient.post<ExpenseDto>('/api/expenses', expenseData);
    return response.data;
  },

  // تحديث مصروف
  updateExpense: async (id: number, expenseData: UpdateExpenseDto): Promise<ExpenseDto> => {
    const response = await apiClient.put<ExpenseDto>(`/api/expenses/${id}`, expenseData);
    return response.data;
  },

  // حذف مصروف
  deleteExpense: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/expenses/${id}`);
  },

  // الحصول على ملخص المصروفات
  getExpensesSummary: async (): Promise<ExpensesSummaryDto> => {
    const response = await apiClient.get<ExpensesSummaryDto>('/api/expenses/summary');
    return response.data;
  },

  // البحث في المصروفات
  searchExpenses: async (query: string): Promise<ExpenseDto[]> => {
    const response = await apiClient.get<ExpenseDto[]>(`/api/expenses/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // الحصول على المصروفات حسب النوع
  getExpensesByType: async (expenseType: string): Promise<ExpenseDto[]> => {
    const response = await apiClient.get<ExpenseDto[]>(`/api/expenses/by-type?type=${encodeURIComponent(expenseType)}`);
    return response.data;
  },

  // الحصول على المصروفات حسب الفترة
  getExpensesByPeriod: async (startDate: string, endDate: string): Promise<ExpenseDto[]> => {
    const response = await apiClient.get<ExpenseDto[]>(`/api/expenses/by-period?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // الحصول على أنواع المصروفات
  getExpenseTypes: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/api/expenses/types');
    return response.data;
  },

  // الحصول على إحصائيات المصروفات اليومية
  getDailyExpenses: async (date: string): Promise<ExpenseDto[]> => {
    const response = await apiClient.get<ExpenseDto[]>(`/api/expenses/daily?date=${date}`);
    return response.data;
  },

  // الحصول على إحصائيات المصروفات الشهرية
  getMonthlyExpenses: async (year: number, month: number): Promise<ExpenseDto[]> => {
    const response = await apiClient.get<ExpenseDto[]>(`/api/expenses/monthly?year=${year}&month=${month}`);
    return response.data;
  },
};
