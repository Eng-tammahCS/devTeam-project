// خدمة المصادقة

import { apiClient } from './api';
import type { 
  LoginDto, 
  RegisterDto, 
  AuthResponse, 
  UserDto, 
  ChangePasswordDto, 
  ResetPasswordDto, 
  ConfirmResetPasswordDto 
} from '@/types/auth';

export const authService = {
  // تسجيل الدخول
  login: async (loginData: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', loginData);
    return response.data;
  },

  // تسجيل مستخدم جديد
  register: async (registerData: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', registerData);
    return response.data;
  },

  // تسجيل الخروج
  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // تحديث التوكن
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/refresh');
    return response.data;
  },

  // الحصول على بيانات المستخدم الحالي
  getCurrentUser: async (): Promise<UserDto> => {
    const response = await apiClient.get<UserDto>('/api/auth/me');
    return response.data;
  },

  // تغيير كلمة المرور
  changePassword: async (passwordData: ChangePasswordDto): Promise<void> => {
    await apiClient.post('/api/auth/change-password', passwordData);
  },

  // طلب إعادة تعيين كلمة المرور
  requestPasswordReset: async (resetData: ResetPasswordDto): Promise<void> => {
    await apiClient.post('/api/auth/request-password-reset', resetData);
  },

  // تأكيد إعادة تعيين كلمة المرور
  confirmPasswordReset: async (confirmData: ConfirmResetPasswordDto): Promise<void> => {
    await apiClient.post('/api/auth/confirm-password-reset', confirmData);
  },

  // التحقق من صحة التوكن
  validateToken: async (): Promise<boolean> => {
    try {
      await apiClient.get('/api/auth/validate');
      return true;
    } catch {
      return false;
    }
  },
};
