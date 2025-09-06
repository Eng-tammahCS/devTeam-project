// أنواع المصادقة

export interface LoginDto {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  phoneNumber?: string;
  image?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordDto {
  email: string;
}

export interface ConfirmResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresAt: string;
  user: UserDto;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  image?: string;
  permissions: string[];
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  roleId: number;
  isActive?: boolean;
  image?: string;
}

export interface UpdateUserDto {
  email: string;
  fullName?: string;
  phoneNumber?: string;
  roleId: number;
  isActive: boolean;
  image?: string;
}

export interface UsersSummaryDto {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  usersLoggedInToday: number;
  roleDistribution: UserRoleDistributionDto[];
}

export interface UserRoleDistributionDto {
  roleName: string;
  userCount: number;
  percentage: number;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  resource: string;
  action: string;
}
