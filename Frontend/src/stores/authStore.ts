// متجر المصادقة

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserDto, LoginDto } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthState {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  setUser: (user: UserDto) => void;
  setToken: (token: string) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginDto) => {
        set({ isLoading: true, error: null });
        
        // Demo Mode - تسجيل دخول تجريبي
        if (credentials.username === 'admin' && credentials.password === 'password123') {
          // محاكاة تأخير الشبكة
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const demoUser: UserDto = {
            id: 1,
            username: 'admin',
            fullName: 'مدير النظام',
            email: 'admin@example.com',
            roleName: 'Admin',
            permissions: ['all'],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          const demoToken = 'demo-token-' + Date.now();
          
          set({
            user: demoUser,
            token: demoToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        }
        
        // محاولة الاتصال بـ Backend الحقيقي
        try {
          const response = await authService.login(credentials);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Backend connection failed:', error);
          set({
            error: 'فشل في الاتصال بالخادم. تأكد من تشغيل Backend على http://localhost:5000',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: UserDto) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isAuthenticated: false, user: null, token: null, isLoading: false });
        }
      },

      hasRole: (role: string) => {
        const { user } = get();
        return user?.roleName === role;
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        return user?.permissions?.includes(permission) || false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
