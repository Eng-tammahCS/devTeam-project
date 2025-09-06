import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import type { ProductDto, CreateProductDto, UpdateProductDto } from "@/types/product";
import type { CategoryDto } from "@/types/category";
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Download,
  Upload,
  Barcode,
  Image as ImageIcon,
  Loader2,
  RefreshCw
} from "lucide-react";

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const queryClient = useQueryClient();

  // استعلام المنتجات
  const { data: productsData, isLoading, error, refetch } = useQuery({
    queryKey: ['products', { searchTerm, selectedCategory }],
    queryFn: () => productService.getProducts({ 
      search: searchTerm || undefined,
      categoryId: selectedCategory || undefined 
    }),
    retry: 1,
  });

  // استعلام الفئات
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    retry: 1,
  });

  // استعلام ملخص المنتجات
  const { data: summaryData } = useQuery({
    queryKey: ['products-summary'],
    queryFn: () => productService.getProductsSummary(),
    retry: 1,
  });

  // طفرة حذف المنتج
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-summary'] });
      toast.success("تم حذف المنتج بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "فشل في حذف المنتج");
    },
  });

  // طفرة تبديل حالة المنتج
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => productService.toggleProductStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-summary'] });
      toast.success("تم تحديث حالة المنتج بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "فشل في تحديث حالة المنتج");
    },
  });

  const products = productsData?.items || [];
  const categories = categoriesData || [];

  // تصدير إلى Excel
  const exportToExcel = () => {
    if (!products.length) return;

    const exportData = products.map(product => ({
      'اسم المنتج': product.name,
      'الوصف': product.description || '',
      'SKU': product.sku,
      'الباركود': product.barcode,
      'الفئة': product.categoryName,
      'العلامة التجارية': product.brand || '',
      'سعر الشراء': product.buyPrice,
      'سعر البيع': product.sellPrice,
      'المخزون': product.stock,
      'الحد الأدنى': product.minStock,
      'الحد الأقصى': product.maxStock || '',
      'الوحدة': product.unit,
      'الحالة': product.isActive ? 'نشط' : 'غير نشط',
      'الموقع': product.location || '',
      'تاريخ الإنشاء': new Date(product.createdAt).toLocaleDateString('ar-SA'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المنتجات');
    
    const fileName = `المنتجات_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success("تم تصدير البيانات بنجاح");
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: number) => {
    toggleStatusMutation.mutate(id);
  };

  const handleEditProduct = (product: ProductDto) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? { label: "نشط", variant: "default" as const }
      : { label: "غير نشط", variant: "destructive" as const };
  };

  const getStockBadge = (stock: number, minStock: number) => {
    if (stock <= 0) {
      return { label: "نفد المخزون", variant: "destructive" as const };
    } else if (stock <= minStock) {
      return { label: "مخزون منخفض", variant: "secondary" as const };
    } else {
      return { label: "متوفر", variant: "default" as const };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>جاري تحميل المنتجات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">فشل في تحميل المنتجات</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in rtl-layout">
      {/* Header */}
      <div className="flex justify-between items-center" dir="rtl">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-foreground">إدارة المنتجات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة المنتجات والمخزون في النظام
          </p>
        </div>
        <div className="flex items-center gap-2" dir="rtl">
          <Button 
            onClick={exportToExcel}
            variant="outline" 
            className="flex items-center gap-2 hover:shadow-md transition-shadow"
          >
            <Download className="h-4 w-4" />
            تصدير Excel
          </Button>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2 hover:shadow-md transition-shadow" 
            dir="rtl"
          >
            <Plus className="h-4 w-4" />
            إضافة منتج جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" dir="rtl">
        <Card className="border-r-4 border-r-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              إجمالي المنتجات
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.totalProducts || products.length}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="border-r-4 border-r-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              المنتجات النشطة
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.activeProducts || products.filter(p => p.isActive).length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-r-4 border-r-yellow-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              مخزون منخفض
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.lowStockProducts || products.filter(p => p.stock <= p.minStock).length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-r-4 border-r-red-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              نفد المخزون
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.outOfStockProducts || products.filter(p => p.stock <= 0).length}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">فلترة المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end" dir="rtl">
            <div className="flex-1">
              <Label htmlFor="search" className="text-right">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="البحث في المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="category" className="text-right">الفئة</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الفئات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الفئات</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2 justify-end">
            <Package className="h-5 w-5" />
            جميع المنتجات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table dir="rtl">
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="text-right font-semibold">الإجراءات</TableHead>
                <TableHead className="text-right font-semibold">الحالة</TableHead>
                <TableHead className="text-right font-semibold">المخزون</TableHead>
                <TableHead className="text-right font-semibold">الأسعار</TableHead>
                <TableHead className="text-right font-semibold">الفئة</TableHead>
                <TableHead className="text-right font-semibold">SKU</TableHead>
                <TableHead className="text-right font-semibold">المنتج</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm || selectedCategory ? "لا توجد منتجات مطابقة للفلتر" : "لا توجد منتجات"}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end" dir="rtl">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" title="عرض التفاصيل">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-accent" 
                          title="تعديل"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                          title="حذف"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(product.id)}
                        disabled={toggleStatusMutation.isPending}
                        className="p-0 h-auto"
                      >
                        <Badge variant={getStatusBadge(product.isActive).variant}>
                          {getStatusBadge(product.isActive).label}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className="font-medium">{product.stock} {product.unit}</div>
                        <Badge variant={getStockBadge(product.stock, product.minStock).variant} className="text-xs">
                          {getStockBadge(product.stock, product.minStock).label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">شراء: {product.buyPrice} ر.س</div>
                        <div className="font-medium text-green-600">بيع: {product.sellPrice} ر.س</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{product.categoryName}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className="font-mono text-sm">{product.sku}</div>
                        <div className="text-xs text-muted-foreground">{product.barcode}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                        {product.brand && (
                          <div className="text-xs text-blue-600">{product.brand}</div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}