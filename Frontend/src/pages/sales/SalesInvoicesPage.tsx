import { useState } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesService } from "@/services/salesService";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import type { SalesInvoiceDto } from "@/types/sales";
import {
  Receipt,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  RefreshCw
} from "lucide-react";

export function SalesInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const queryClient = useQueryClient();

  // استعلام فواتير المبيعات
  const { data: invoicesData, isLoading, error, refetch } = useQuery({
    queryKey: ['sales-invoices', { searchTerm, statusFilter, dateFilter }],
    queryFn: () => salesService.getInvoices({
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      dateFrom: dateFilter || undefined
    }),
    retry: 1,
  });

  // استعلام ملخص المبيعات
  const { data: summaryData } = useQuery({
    queryKey: ['sales-summary'],
    queryFn: () => salesService.getSalesSummary(),
    retry: 1,
  });

  // طفرة حذف الفاتورة
  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: number) => salesService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['sales-summary'] });
      toast.success("تم حذف الفاتورة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "فشل في حذف الفاتورة");
    },
  });

  const invoices = invoicesData?.items || [];

  // تصدير إلى Excel
  const exportToExcel = () => {
    if (!invoices.length) return;

    const exportData = invoices.map(invoice => ({
      'رقم الفاتورة': invoice.invoiceNumber,
      'اسم العميل': invoice.customerName,
      'هاتف العميل': invoice.customerPhone || '',
      'تاريخ الفاتورة': new Date(invoice.invoiceDate).toLocaleDateString('ar-SA'),
      'طريقة الدفع': invoice.paymentMethod === 'cash' ? 'نقدي' : 'بطاقة',
      'المجموع الفرعي': invoice.subtotal,
      'الضريبة': invoice.taxAmount,
      'الإجمالي': invoice.totalAmount,
      'الحالة': invoice.status === 'completed' ? 'مكتملة' : 'معلقة',
      'عدد الأصناف': invoice.itemsCount,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'فواتير المبيعات');
    
    const fileName = `فواتير_المبيعات_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success("تم تصدير البيانات بنجاح");
  };

  const handleDeleteInvoice = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) {
      deleteInvoiceMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: "مكتملة", variant: "default" as const };
      case 'pending':
        return { label: "معلقة", variant: "secondary" as const };
      case 'cancelled':
        return { label: "ملغاة", variant: "destructive" as const };
      default:
        return { label: status, variant: "outline" as const };
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    return method === 'cash' 
      ? { label: "نقدي", variant: "default" as const }
      : { label: "بطاقة", variant: "secondary" as const };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>جاري تحميل فواتير المبيعات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">فشل في تحميل فواتير المبيعات</p>
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
          <h1 className="text-3xl font-bold text-foreground">فواتير المبيعات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وعرض فواتير المبيعات
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
            فاتورة جديدة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" dir="rtl">
        <Card className="border-r-4 border-r-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              إجمالي الفواتير
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.totalInvoices || invoices.length}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="border-r-4 border-r-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              إجمالي المبيعات
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.totalSales?.toFixed(2) || '0.00'} ر.س
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-r-4 border-r-yellow-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              فواتير اليوم
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.todayInvoices || 0}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-r-4 border-r-purple-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-right">
              متوسط الفاتورة
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground text-right">
              {summaryData?.averageInvoiceValue?.toFixed(2) || '0.00'} ر.س
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">فلترة الفواتير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end" dir="rtl">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث في الفواتير..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الحالات</SelectItem>
                  <SelectItem value="completed">مكتملة</SelectItem>
                  <SelectItem value="pending">معلقة</SelectItem>
                  <SelectItem value="cancelled">ملغاة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-right"
              />
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

      {/* Invoices Table */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2 justify-end">
            <Receipt className="h-5 w-5" />
            جميع الفواتير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table dir="rtl">
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="text-right font-semibold">الإجراءات</TableHead>
                <TableHead className="text-right font-semibold">الإجمالي</TableHead>
                <TableHead className="text-right font-semibold">طريقة الدفع</TableHead>
                <TableHead className="text-right font-semibold">الحالة</TableHead>
                <TableHead className="text-right font-semibold">العميل</TableHead>
                <TableHead className="text-right font-semibold">التاريخ</TableHead>
                <TableHead className="text-right font-semibold">رقم الفاتورة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter || dateFilter ? "لا توجد فواتير مطابقة للفلتر" : "لا توجد فواتير"}
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end" dir="rtl">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" title="عرض التفاصيل">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" title="طباعة">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                          title="حذف"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          disabled={deleteInvoiceMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className="font-bold text-green-600">{invoice.totalAmount.toFixed(2)} ر.س</div>
                        <div className="text-xs text-muted-foreground">
                          {invoice.itemsCount} صنف
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getPaymentMethodBadge(invoice.paymentMethod).variant}>
                        {getPaymentMethodBadge(invoice.paymentMethod).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusBadge(invoice.status).variant}>
                        {getStatusBadge(invoice.status).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className="font-medium">{invoice.customerName}</div>
                        {invoice.customerPhone && (
                          <div className="text-sm text-muted-foreground">{invoice.customerPhone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(invoice.invoiceDate).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-mono font-medium">{invoice.invoiceNumber}</div>
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