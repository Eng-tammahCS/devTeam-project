  import React, { createContext, useContext, useState, useEffect } from 'react';

  export type UserRole = 'admin' | 'pos';

  export interface User {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  }

  interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    isLoading: boolean;
  }

  const AuthContext = createContext<AuthContextType | null>(null);

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth يجب استخدامه داخل AuthProvider');
    }
    return context;
  };

  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
      console.log('AuthProvider: تحقق من الجلسة الموجودة');
      const checkExistingSession = () => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        console.log('AuthProvider: storedUser =', storedUser);
        console.log('AuthProvider: token =', token);
        
        if (storedUser && token) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('AuthProvider: تم تحليل المستخدم بنجاح:', parsedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error('خطأ في تحليل بيانات المستخدم:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
        console.log('AuthProvider: انتهى التحقق، تعيين isLoading إلى false');
        setIsLoading(false);
      };

      checkExistingSession();
    }, []);

    const login = async (username: string, password: string) => {
      setIsLoading(true);
      
      try {
        // Demo login - In real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        let demoUser: User;
        
        // Demo users for testing
        if (username === 'admin' && password === 'admin123') {
          demoUser = {
            id: 1,
            username: 'admin',
            fullName: 'مدير النظام',
            email: 'admin@store.com',
            role: 'admin',
            isActive: true
          };
        } else if (username === 'pos' && password === 'pos123') {
          demoUser = {
            id: 2,
            username: 'pos',
            fullName: 'موظف نقاط البيع',
            email: 'pos@store.com',
            role: 'pos',
            isActive: true
          };
        } else {
          return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
        }

        // Store user and token
        const demoToken = `demo-token-${Date.now()}`;
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('token', demoToken);
        
        setUser(demoUser);
        
        return { success: true };
      } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' };
      } finally {
        setIsLoading(false);
      }
    };


    const logout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    };

    return (
      <AuthContext.Provider value={{ user, login, logout, isLoading }}>
        {children}
      </AuthContext.Provider>
    );
  };