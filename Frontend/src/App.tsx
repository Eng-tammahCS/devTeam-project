import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { POSPage } from "./pages/pos/POSPage";
import { SalesInvoicesPage } from "./pages/sales/SalesInvoicesPage";
import { ProductsPage } from "./pages/inventory/ProductsPage";
import { ReturnsPage } from "./pages/returns/ReturnsPage";
import { InventoryDashboard } from "./pages/inventory/InventoryDashboard";
import { CategoriesPage } from "./pages/inventory/CategoriesPage";
import { PurchaseInvoicesPage } from "./pages/purchases/PurchaseInvoicesPage";
import { SuppliersPage } from "./pages/suppliers/SuppliersPage";
import { ExpensesPage } from "./pages/expenses/ExpensesPage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { UsersPage } from "./pages/users/UsersPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { AuditPage } from "./pages/audit/AuditPage";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  
  console.log('ProtectedRoute: user =', user);
  console.log('ProtectedRoute: isLoading =', isLoading);
  console.log('ProtectedRoute: isAuthenticated =', isAuthenticated);
  
  if (isLoading) {
    console.log('ProtectedRoute: إظهار شاشة التحميل');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute: لا يوجد مستخدم موثق، إعادة توجيه إلى /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute: مستخدم موثق، إظهار المحتوى');
  return <>{children}</>;
}

// App Routes Component
function AppRoutes() {
  const { user, isAuthenticated } = useAuthStore();
  
  console.log('AppRoutes: المستخدم الحالي =', user);
  console.log('AppRoutes: isAuthenticated =', isAuthenticated);
  console.log('AppRoutes: المسار الحالي =', window.location.pathname);
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Simplified root route - direct redirect without ProtectedRoute wrapper */}
      <Route path="/" element={
        isAuthenticated && user ? (
          user.roleName === 'Admin' ? <Navigate to="/dashboard" replace /> : 
          user.roleName === 'POS' ? <Navigate to="/pos" replace /> :
          <Navigate to="/pos" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['Admin']}>
            <Index />
          </RoleGuard>
        </ProtectedRoute>
      } />
      
      <Route path="/pos" element={
        <ProtectedRoute>
          <POSPage />
        </ProtectedRoute>
      } />

      <Route path="/sales/invoices" element={
        <ProtectedRoute>
          <SalesInvoicesPage />
        </ProtectedRoute>
      } />

      <Route path="/inventory/products" element={
        <ProtectedRoute>
          <ProductsPage />
        </ProtectedRoute>
      } />

      <Route path="/returns" element={
        <ProtectedRoute>
          <ReturnsPage />
        </ProtectedRoute>
      } />

      <Route path="/inventory/dashboard" element={
        <ProtectedRoute>
          <InventoryDashboard />
        </ProtectedRoute>
      } />

      <Route path="/categories" element={
        <ProtectedRoute>
          <CategoriesPage />
        </ProtectedRoute>
      } />

      <Route path="/purchase-invoices" element={
        <ProtectedRoute>
          <PurchaseInvoicesPage />
        </ProtectedRoute>
      } />

      <Route path="/suppliers" element={
        <ProtectedRoute>
          <SuppliersPage />
        </ProtectedRoute>
      } />

      <Route path="/expenses" element={
        <ProtectedRoute>
          <ExpensesPage />
        </ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute>
          <ReportsPage />
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['Admin']}>
            <UsersPage />
          </RoleGuard>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['Admin']}>
            <SettingsPage />
          </RoleGuard>
        </ProtectedRoute>
      } />

      <Route path="/audit" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['Admin']}>
            <AuditPage />
          </RoleGuard>
        </ProtectedRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground" dir="rtl">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;