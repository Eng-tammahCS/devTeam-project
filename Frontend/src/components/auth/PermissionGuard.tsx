// مكون حماية الصلاحيات

import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions: string[];
  fallback?: ReactNode;
  requireAll?: boolean; // إذا كان true، يجب أن يملك جميع الصلاحيات
}

export const PermissionGuard = ({ 
  children, 
  requiredPermissions, 
  fallback = null,
  requireAll = false
}: PermissionGuardProps) => {
  const { hasPermission } = useAuthStore();

  const hasRequiredPermissions = requireAll
    ? requiredPermissions.every(permission => hasPermission(permission))
    : requiredPermissions.some(permission => hasPermission(permission));

  if (!hasRequiredPermissions) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
