import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import type { CategoryDto } from "@/types/category";
import { RefreshCw, Search, Plus, Edit, Trash2, Tag, Loader2, Download } from "lucide-react";

export function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // استعلام الفئات
  const { data: categoriesData, isLoading, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    retry: 1,
  });

  // طفرة حذف الفئة
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("تم حذف الفئة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "فشل في حذف الفئة");
    },
  });

  // طفرة تبديل حالة الفئة
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => categoryService.toggleCategoryStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("تم تحديث حالة الفئة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "فشل في تحديث حالة الفئة");
    },
  });

  const categories = categoriesData || [];

  // تصدير إلى Excel
  const exportToExcel = () => {
    if (!categories.length) return;

    const exportData = categories.map(category => ({
      'اسم الفئة': category.name,
      'الوصف': category.description || '',
      'عدد المنتجات': category.productsCount || 0,
      'الحالة': category.isActive ? 'نشط' : 'غير نشط',
      'تاريخ الإنشاء': new Date(category.createdAt).toLocaleDateString('ar-SA'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الفئات');
    
    const fileName = `الفئات_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success("تم تصدير البيانات بنجاح");
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: number) => {
    toggleStatusMutation.mutate(id);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? { label: "نشط", variant: "default" as const }
      : { label: "غير نشط", variant: "destructive" as const };
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>جاري تحميل الفئات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">فشل في تحميل الفئات</p>
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
          <h1 className="text-3xl font-bold text-foreground">إدارة الفئات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة فئات المنتجات في النظام
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
          <Button className="flex items-center gap-2 hover:shadow-md transition-shadow" dir="rtl">
            <Plus className="h-4 w-4" />
            إضافة فئة جديدة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
        <Card className="border-r-4 border-r-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              إجمالي الفئات
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {categories.length}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="border-r-4 border-r-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              الفئات النشطة
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {categories.filter(c => c.isActive).length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-r-4 border-r-purple-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              إجمالي المنتجات
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {categories.reduce((sum, c) => sum + (c.productsCount || 0), 0)}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">البحث في الفئات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end" dir="rtl">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث في الفئات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
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

      {/* Categories Table */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2 justify-end">
            <Tag className="h-5 w-5" />
            جميع الفئات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table dir="rtl">
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="text-right font-semibold">الإجراءات</TableHead>
                <TableHead className="text-right font-semibold">عدد المنتجات</TableHead>
                <TableHead className="text-right font-semibold">الحالة</TableHead>
                <TableHead className="text-right font-semibold">الوصف</TableHead>
                <TableHead className="text-right font-semibold">اسم الفئة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "لا توجد فئات مطابقة للبحث" : "لا توجد فئات"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end" dir="rtl">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" title="تعديل">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                          title="حذف"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={deleteCategoryMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-lg font-bold">
                        {category.productsCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(category.id)}
                        disabled={toggleStatusMutation.isPending}
                        className="p-0 h-auto"
                      >
                        <Badge variant={getStatusBadge(category.isActive).variant}>
                          {getStatusBadge(category.isActive).label}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {category.description || 'لا يوجد وصف'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium text-lg">{category.name}</div>
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