// أنواع الموردين

export interface SupplierDto {
  id: number;
  name: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDto {
  name: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  isActive?: boolean;
}

export interface UpdateSupplierDto {
  id: number;
  name: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
}

export interface SupplierSummary {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  totalPurchases: number;
  averagePurchaseValue: number;
}
