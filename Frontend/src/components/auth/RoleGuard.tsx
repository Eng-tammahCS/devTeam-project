// مكون حماية الأدوار

import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export const RoleGuard = ({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleGuardProps) => {
  const { user } = useAuthStore();

  if (!user) {
    return <>{fallback}</>;
  }

  const hasRequiredRole = allowedRoles.includes(user.roleName);

  if (!hasRequiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
