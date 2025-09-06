import { useState, useEffect } from "react";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Search, Plus, Eye, Edit, Trash2, Users, Shield, UserCheck, UserX, Download, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import type { UserDto } from "@/types/auth";

// استخدام UserDto من types/auth بدلاً من interface محلي

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // استعلام المستخدمين
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
    retry: 1,
  });

  // استعلام ملخص المستخدمين
  const { data: summaryData } = useQuery({
    queryKey: ['users-summary'],
    queryFn: () => userService.getUsersSummary(),
    retry: 1,
  });

  // طفرة حذف المستخدم
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-summary'] });
      toast.success("تم حذف المستخدم بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "فشل في حذف المستخدم");
    },
  });

  // طفرة تبديل حالة المستخدم
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => userService.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-summary'] });
      toast.success("تم تحديث حالة المستخدم بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "فشل في تحديث حالة المستخدم");
    },
  });

  const getRoleBadge = (role: string) => {
    return role === 'Admin' 
      ? { label: "مدير النظام", variant: "default" as const, icon: Shield }
      : { label: "موظف نقاط البيع", variant: "secondary" as const, icon: Users };
  };

  const getStatusBadge = (status: boolean) => {
    return status 
      ? { label: "نشط", variant: "default" as const, icon: UserCheck }
      : { label: "غير نشط", variant: "destructive" as const, icon: UserX };
  };

  const getUserInitials = (fullName: string) => {
    return fullName.split(' ').map(name => name[0]).join('').toUpperCase();
  };

  // تصدير إلى Excel
  const exportToExcel = () => {
    if (!usersData?.items) return;

    const exportData = usersData.items.map(user => ({
      'الاسم الكامل': user.fullName,
      'البريد الإلكتروني': user.email,
      'الصلاحية': user.roleName === 'Admin' ? 'مدير النظام' : 'موظف نقاط البيع',
      'الحالة': user.isActive ? 'نشط' : 'غير نشط',
      'تاريخ الإنشاء': new Date(user.createdAt).toLocaleDateString('ar-SA'),
      'تاريخ آخر تحديث': new Date(user.updatedAt).toLocaleDateString('ar-SA'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المستخدمين');
    
    const fileName = `المستخدمين_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success("تم تصدير البيانات بنجاح");
  };

  const users = usersData?.items || [];
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: number) => {
    toggleStatusMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>جاري تحميل المستخدمين...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">فشل في تحميل المستخدمين</p>
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
          <h1 className="text-3xl font-bold text-foreground">إدارة المستخدمين</h1>
          <p className="text-muted-foreground mt-2">
            إدارة المستخدمين وصلاحياتهم في النظام
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
            إضافة مستخدم جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" dir="rtl">
        <Card className="border-r-4 border-r-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              إجمالي المستخدمين
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.totalUsers || users.length}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="border-r-4 border-r-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              المستخدمين النشطين
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.activeUsers || users.filter(user => user.isActive).length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-r-4 border-r-purple-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              المديرين
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.adminUsers || users.filter(user => user.roleName === 'Admin').length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-r-4 border-r-yellow-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              موظفي نقاط البيع
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.posUsers || users.filter(user => user.roleName === 'POS').length}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center" dir="rtl">
            <CardTitle className="text-right flex items-center gap-2 justify-end">
              <Users className="h-5 w-5" />
              جميع المستخدمين
            </CardTitle>
            <div className="flex items-center gap-4" dir="rtl">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث في المستخدمين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right hover:border-primary focus:border-primary transition-colors w-64"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                title="تحديث" 
                className="hover:bg-accent"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table dir="rtl" className="hover:bg-muted/50">
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="text-right font-semibold">الإجراءات</TableHead>
                <TableHead className="text-right font-semibold">تاريخ آخر تحديث</TableHead>
                <TableHead className="text-right font-semibold">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right font-semibold">الحالة</TableHead>
                <TableHead className="text-right font-semibold">الصلاحية</TableHead>
                <TableHead className="text-right font-semibold">البريد الإلكتروني</TableHead>
                <TableHead className="text-right font-semibold">المستخدم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "لا توجد مستخدمين مطابقين للبحث" : "لا توجد مستخدمين"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end" dir="rtl">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" title="عرض التفاصيل">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" title="تعديل">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                          title="حذف"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteUserMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(user.updatedAt).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        disabled={toggleStatusMutation.isPending}
                        className="p-0 h-auto"
                      >
                        <Badge variant={getStatusBadge(user.isActive).variant} className="flex items-center gap-1 justify-center w-fit font-medium">
                          {React.createElement(getStatusBadge(user.isActive).icon, { className: "h-3 w-3" })}
                          {getStatusBadge(user.isActive).label}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getRoleBadge(user.roleName).variant} className="flex items-center gap-1 justify-center w-fit font-medium">
                        {React.createElement(getRoleBadge(user.roleName).icon, { className: "h-3 w-3" })}
                        {getRoleBadge(user.roleName).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-blue-600">{user.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-3 justify-end" dir="rtl">
                        <div className="text-right">
                          <div className="font-medium text-blue-600">{user.fullName}</div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                            {getUserInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
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