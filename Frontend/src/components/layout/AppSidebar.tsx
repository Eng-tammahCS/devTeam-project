import { NavLink, useLocation } from "react-router-dom";
import {
  Calculator,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Home,
  ShoppingBag,
  Truck,
  RotateCcw,
  FolderOpen,
  DollarSign,
  Shield,
  FileText,
  AlertTriangle,
  ChevronDown,
  Store
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

// POS Role Menu Items
const posMenuItems: MenuItem[] = [
  {
    title: "نقاط البيع",
    url: "/pos",
    icon: Calculator,
  },
  {
    title: "إدارة المبيعات",
    icon: ShoppingCart,
    items: [
      { title: "فواتير المبيعات", url: "/sales/invoices" },
      { title: "العملاء", url: "/customers" }
    ]
  },
  {
    title: "إدارة المخزون", 
    icon: Package,
    items: [
      { title: "لوحة تحكم المخزون", url: "/inventory/dashboard" },
      { title: "المنتجات", url: "/inventory/products" },
      { title: "الفئات", url: "/categories" }
    ]
  },
  {
    title: "إدارة المشتريات",
    icon: ShoppingBag,
    items: [
      { title: "فواتير الشراء", url: "/purchase-invoices" },
      { title: "الموردين", url: "/suppliers" }
    ]
  },
  {
    title: "المرتجعات",
    url: "/returns",
    icon: RotateCcw,
  }
];

// Admin Role Menu Items  
const adminMenuItems: MenuItem[] = [
  {
    title: "لوحة التحكم الرئيسية",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "نقاط البيع",
    url: "/pos", 
    icon: Calculator,
  },
  {
    title: "إدارة المبيعات",
    icon: ShoppingCart,
    items: [
      { title: "فواتير المبيعات", url: "/sales/invoices" },
      { title: "المرتجعات", url: "/returns" }
    ]
  },
  {
    title: "إدارة المخزون",
    icon: Package,
    items: [
      { title: "لوحة تحكم المخزون", url: "/inventory/dashboard" },
      { title: "المنتجات", url: "/inventory/products" },
      { title: "الفئات", url: "/categories" }
    ]
  },
  {
    title: "إدارة المشتريات",
    icon: ShoppingBag,
    items: [
      { title: "فواتير الشراء", url: "/purchase-invoices" },
      { title: "الموردين", url: "/suppliers" }
    ]
  },
  {
    title: "الإدارة المالية",
    icon: DollarSign,
    items: [
      { title: "المصروفات", url: "/expenses" },
      { title: "التقارير الشاملة", url: "/reports" }
    ]
  },
  {
    title: "إدارة النظام",
    icon: Settings,
    items: [
      { title: "إدارة المستخدمين", url: "/users" },
      { title: "الإعدادات العامة", url: "/settings" },
      { title: "سجل التدقيق", url: "/audit" }
    ]
  }
];

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const { state } = useSidebar();
  const location = useLocation();

  const menuItems = user?.roleName === 'Admin' ? adminMenuItems : posMenuItems;
  const isCollapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = (fullName: string) => {
    return fullName.split(' ').map(name => name[0]).join('').toUpperCase();
  };

  return (
    <Sidebar className="border-l border-sidebar-border bg-sidebar sidebar-rtl" dir="rtl" side="right">
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-right">
                <h1 className="text-lg font-bold text-sidebar-foreground">
                  متجر الإلكترونيات
                </h1>
                <p className="text-sm text-sidebar-foreground/60">
                  النظام الذكي
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium px-4 py-2">
            القائمة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            {!isCollapsed && <span className="text-right">{item.title}</span>}
                          </div>
                          {!isCollapsed && <ChevronDown className="h-4 w-4" />}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!isCollapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.url}>
                                <SidebarMenuSubButton 
                                  asChild
                                  isActive={location.pathname === subItem.url}
                                >
                                  <NavLink to={subItem.url}>
                                    {subItem.title}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild
                      isActive={location.pathname === item.url}
                    >
                      <NavLink 
                        to={item.url!}
                        className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span className="text-right">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {user && (
          <div className="space-y-4">
            {!isCollapsed && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {getUserInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {user.roleName === 'Admin' ? 'مدير النظام' : 'موظف نقاط البيع'}
                  </p>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "default"}
              onClick={handleLogout}
              className="w-full text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="mr-2">تسجيل الخروج</span>}
            </Button>
          </div>
        )}
        
        {/* Sidebar Toggle */}
        <div className="flex justify-center pt-2">
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}