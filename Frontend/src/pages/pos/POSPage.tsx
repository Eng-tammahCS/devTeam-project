import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { salesService } from "@/services/salesService";
import { toast } from "sonner";
import type { ProductDto } from "@/types/product";
import type { CreateSalesInvoiceDto, SalesInvoiceItemDto } from "@/types/sales";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  Calculator,
  CreditCard,
  Banknote,
  Receipt,
  Scan,
  Users,
  Package,
  Loader2,
  X
} from "lucide-react";

interface CartItem {
  product: ProductDto;
  quantity: number;
  subtotal: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export function POSPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  // استعلام المنتجات
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', { search: searchTerm }],
    queryFn: () => productService.getProducts({ 
      search: searchTerm || undefined,
      isActive: true 
    }),
    retry: 1,
  });

  // طفرة إنشاء فاتورة مبيعات
  const createInvoiceMutation = useMutation({
    mutationFn: (invoiceData: CreateSalesInvoiceDto) => salesService.createInvoice(invoiceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-invoices'] });
      setCart([]);
      setSelectedCustomer(null);
      toast.success("تم إنشاء الفاتورة بنجاح");
      setIsProcessing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "فشل في إنشاء الفاتورة");
      setIsProcessing(false);
    },
  });

  const products = productsData?.items || [];
  const filteredProducts = products.filter(product => 
    product.stock > 0 && product.isActive
  );

  // إضافة منتج للسلة
  const addToCart = (product: ProductDto) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error("الكمية المطلوبة غير متوفرة في المخزون");
        return;
      }
      updateCartItem(product.id, existingItem.quantity + 1);
    } else {
      if (product.stock < 1) {
        toast.error("المنتج غير متوفر في المخزون");
        return;
      }
      const newItem: CartItem = {
        product,
        quantity: 1,
        subtotal: product.sellPrice
      };
      setCart([...cart, newItem]);
      toast.success("تم إضافة المنتج للسلة");
    }
  };

  // تحديث كمية منتج في السلة
  const updateCartItem = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      toast.error("الكمية المطلوبة غير متوفرة في المخزون");
      return;
    }

    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity, subtotal: item.product.sellPrice * quantity }
        : item
    ));
  };

  // حذف منتج من السلة
  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // حساب الإجمالي
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.15; // ضريبة 15%
  const total = subtotal + tax;

  // إتمام البيع
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    setIsProcessing(true);

    const invoiceItems: SalesInvoiceItemDto[] = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      unitPrice: item.product.sellPrice,
      totalPrice: item.subtotal
    }));

    const invoiceData: CreateSalesInvoiceDto = {
      customerName: selectedCustomer?.name || "عميل نقدي",
      customerPhone: selectedCustomer?.phone || "",
      customerEmail: selectedCustomer?.email || "",
      paymentMethod: paymentMethod,
      items: invoiceItems,
      subtotal: subtotal,
      taxAmount: tax,
      totalAmount: total,
      notes: ""
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  // مسح السلة
  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background rtl-layout" dir="rtl">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calculator className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">نقاط البيع</h1>
              <p className="text-primary-foreground/80">نظام إدارة المبيعات</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {cart.length} منتج
            </Badge>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {total.toFixed(2)} ر.س
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Products Section */}
        <div className="flex-1 p-6 overflow-auto">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="البحث في المنتجات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 text-right"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100vh-200px)] overflow-auto">
              {productsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToCart(product)}
                    >
                      <CardContent className="p-4">
                        <div className="text-center space-y-2">
                          <div className="h-16 w-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                            <p className="text-xs text-muted-foreground">{product.categoryName}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="font-bold text-green-600">{product.sellPrice} ر.س</div>
                            <Badge variant="outline" className="text-xs">
                              {product.stock} متوفر
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="w-96 bg-muted/30 border-l border-border">
          <div className="h-full flex flex-col">
            {/* Cart Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  السلة
                </h2>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearCart}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>السلة فارغة</p>
                  <p className="text-sm">اختر منتجات لإضافتها للسلة</p>
                </div>
              ) : (
                cart.map((item) => (
                  <Card key={item.product.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateCartItem(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateCartItem(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-sm font-medium">
                          {item.subtotal.toFixed(2)} ر.س
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>الضريبة (15%):</span>
                    <span>{tax.toFixed(2)} ر.س</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي:</span>
                    <span className="text-green-600">{total.toFixed(2)} ر.س</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">طريقة الدفع:</label>
                  <div className="flex gap-2">
                    <Button
                      variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <Banknote className="h-4 w-4 mr-2" />
                      نقدي
                    </Button>
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      بطاقة
                    </Button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full h-12 text-lg font-bold"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <Receipt className="h-5 w-5 mr-2" />
                      إتمام البيع
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}