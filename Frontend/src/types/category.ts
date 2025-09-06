// أنواع الفئات

export interface CategoryDto {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  id: number;
  name: string;
}

export interface CategorySummary {
  totalCategories: number;
  categoriesWithProducts: number;
  emptyCategories: number;
  averageProductsPerCategory: number;
}
