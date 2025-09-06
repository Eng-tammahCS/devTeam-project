# 📋 هيكلة المشروع الشاملة - نظام إدارة متجر الإلكترونيات

## 🎯 نظرة عامة على المشروع

**نظام إدارة متجر الإلكترونيات** هو تطبيق ويب متكامل مبني باستخدام Clean Architecture مع ASP.NET Core Web API في الخلفية و React + TypeScript في الواجهة الأمامية.

### 🏗️ المعمارية العامة
- **Backend**: ASP.NET Core 9.0 Web API مع Clean Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Database**: SQL Server مع Entity Framework Core
- **Authentication**: JWT Bearer Token
- **State Management**: Zustand

---

## 📁 الهيكل العام للمشروع

```
Finnal_Project/
├── 📁 Backend/                          # الخادم الخلفي (ASP.NET Core)
│   ├── 📁 ElectronicsStore.Domain/      # طبقة النطاق (Domain Layer)
│   ├── 📁 ElectronicsStore.Application/ # طبقة التطبيق (Application Layer)
│   ├── 📁 ElectronicsStore.Infrastructure/ # طبقة البنية التحتية (Infrastructure Layer)
│   ├── 📁 ElectronicsStore.WebAPI/     # طبقة الواجهة (Presentation Layer)
│   └── 📄 ElectronicsStore.sln         # ملف الحل الرئيسي
├── 📁 Frontend/                         # الواجهة الأمامية (React)
├── 📁 Database/                         # ملفات قاعدة البيانات
├── 📄 Finnal_Project.sln               # ملف الحل الرئيسي للمشروع
├── 📄 README.md                        # دليل المشروع
└── 📄 package.json                     # إعدادات Node.js
```

---

## 🔧 Backend - الخادم الخلفي

### 1. 📁 ElectronicsStore.Domain (طبقة النطاق)

**الغرض**: يحتوي على الكيانات الأساسية وقواعد العمل

```
ElectronicsStore.Domain/
├── 📁 Entities/                         # الكيانات الأساسية
│   ├── 📄 BaseEntity.cs                # الكيان الأساسي المشترك
│   ├── 📄 User.cs                      # كيان المستخدم
│   ├── 📄 Role.cs                      # كيان الدور
│   ├── 📄 Product.cs                   # كيان المنتج
│   ├── 📄 Category.cs                  # كيان الفئة
│   ├── 📄 Supplier.cs                  # كيان المورد
│   ├── 📄 PurchaseInvoice.cs           # كيان فاتورة الشراء
│   ├── 📄 SalesInvoice.cs              # كيان فاتورة البيع
│   ├── 📄 Returns.cs                   # كيان المرتجعات
│   ├── 📄 Expense.cs                   # كيان المصروفات
│   └── 📄 InventoryLog.cs              # كيان سجل المخزون
├── 📁 Enums/                           # التعدادات
│   ├── 📄 UserRole.cs                  # أدوار المستخدمين
│   └── 📄 InvoiceStatus.cs             # حالات الفواتير
├── 📁 Interfaces/                      # واجهات النطاق
│   ├── 📄 IRepository.cs               # واجهة المستودع العام
│   └── 📄 IUnitOfWork.cs               # واجهة وحدة العمل
├── 📁 ValueObjects/                    # كائنات القيمة
└── 📄 ElectronicsStore.Domain.csproj   # ملف المشروع
```

**الملفات الرئيسية**:
- **BaseEntity.cs**: يحتوي على الخصائص المشتركة (Id, CreatedAt, UpdatedAt)
- **User.cs**: إدارة المستخدمين مع الصلاحيات
- **Product.cs**: إدارة المنتجات مع الفئات والموردين
- **Category.cs**: تصنيف المنتجات
- **Supplier.cs**: إدارة الموردين

### 2. 📁 ElectronicsStore.Application (طبقة التطبيق)

**الغرض**: يحتوي على منطق التطبيق والخدمات

```
ElectronicsStore.Application/
├── 📁 DTOs/                            # كائنات نقل البيانات
│   ├── 📄 UserDto.cs                   # DTO للمستخدم
│   ├── 📄 ProductDto.cs                # DTO للمنتج
│   ├── 📄 CategoryDto.cs               # DTO للفئة
│   ├── 📄 SupplierDto.cs               # DTO للمورد
│   ├── 📄 AuthDto.cs                   # DTO للمصادقة
│   ├── 📄 InventoryDto.cs              # DTO للمخزون
│   ├── 📄 SalesInvoiceDto.cs           # DTO لفواتير البيع
│   ├── 📄 PurchaseInvoiceDto.cs        # DTO لفواتير الشراء
│   ├── 📄 SalesReturnDto.cs            # DTO لمرتجعات البيع
│   ├── 📄 PurchaseReturnDto.cs         # DTO لمرتجعات الشراء
│   ├── 📄 ExpenseDto.cs                # DTO للمصروفات
│   ├── 📄 PermissionDto.cs             # DTO للصلاحيات
│   └── 📄 ReturnsSummaryDto.cs         # DTO لملخص المرتجعات
├── 📁 Interfaces/                      # واجهات الخدمات
│   ├── 📄 IUserService.cs              # واجهة خدمة المستخدمين
│   ├── 📄 IProductService.cs           # واجهة خدمة المنتجات
│   ├── 📄 ICategoryService.cs          # واجهة خدمة الفئات
│   ├── 📄 ISupplierService.cs          # واجهة خدمة الموردين
│   ├── 📄 IInventoryService.cs         # واجهة خدمة المخزون
│   ├── 📄 ISalesInvoiceService.cs      # واجهة خدمة فواتير البيع
│   ├── 📄 IPurchaseInvoiceService.cs   # واجهة خدمة فواتير الشراء
│   ├── 📄 ISalesReturnService.cs       # واجهة خدمة مرتجعات البيع
│   ├── 📄 IPurchaseReturnService.cs    # واجهة خدمة مرتجعات الشراء
│   ├── 📄 IExpenseService.cs           # واجهة خدمة المصروفات
│   ├── 📄 IReturnsService.cs           # واجهة خدمة المرتجعات
│   ├── 📄 IPermissionService.cs        # واجهة خدمة الصلاحيات
│   ├── 📄 IAuthService.cs              # واجهة خدمة المصادقة
│   ├── 📄 IJwtService.cs               # واجهة خدمة JWT
│   └── 📄 IPasswordService.cs          # واجهة خدمة كلمات المرور
├── 📁 Services/                        # تنفيذ الخدمات
│   ├── 📄 UserService.cs               # خدمة المستخدمين
│   ├── 📄 ProductService.cs            # خدمة المنتجات
│   ├── 📄 CategoryService.cs           # خدمة الفئات
│   ├── 📄 SupplierService.cs           # خدمة الموردين
│   ├── 📄 InventoryService.cs          # خدمة المخزون
│   ├── 📄 SalesInvoiceService.cs       # خدمة فواتير البيع
│   ├── 📄 PurchaseInvoiceService.cs    # خدمة فواتير الشراء
│   ├── 📄 SalesReturnService.cs        # خدمة مرتجعات البيع
│   ├── 📄 PurchaseReturnService.cs     # خدمة مرتجعات الشراء
│   ├── 📄 ExpenseService.cs            # خدمة المصروفات
│   ├── 📄 ReturnsService.cs            # خدمة المرتجعات
│   ├── 📄 PermissionService.cs         # خدمة الصلاحيات
│   ├── 📄 JwtService.cs                # خدمة JWT
│   └── 📄 PasswordService.cs           # خدمة كلمات المرور
├── 📁 Models/                          # نماذج التطبيق
│   └── 📄 JwtSettings.cs               # إعدادات JWT
├── 📁 UseCases/                        # حالات الاستخدام
└── 📄 ElectronicsStore.Application.csproj # ملف المشروع
```

**الخدمات الرئيسية**:
- **UserService**: إدارة المستخدمين والصلاحيات
- **ProductService**: إدارة المنتجات والفئات
- **InventoryService**: إدارة المخزون والمتتبع
- **SalesInvoiceService**: إدارة فواتير البيع
- **PurchaseInvoiceService**: إدارة فواتير الشراء

### 3. 📁 ElectronicsStore.Infrastructure (طبقة البنية التحتية)

**الغرض**: يحتوي على تنفيذ الوصول للبيانات والخدمات الخارجية

```
ElectronicsStore.Infrastructure/
├── 📁 Data/                            # طبقة الوصول للبيانات
│   └── 📄 ElectronicsStoreDbContext.cs # سياق قاعدة البيانات
├── 📁 Repositories/                    # مستودعات البيانات
│   ├── 📄 Repository.cs                # المستودع العام
│   └── 📄 UnitOfWork.cs                # وحدة العمل
├── 📁 Configurations/                  # إعدادات Entity Framework
├── 📁 Migrations/                      # ملفات الهجرة
└── 📄 ElectronicsStore.Infrastructure.csproj # ملف المشروع
```

**المكونات الرئيسية**:
- **ElectronicsStoreDbContext**: سياق Entity Framework
- **Repository**: نمط المستودع للوصول للبيانات
- **UnitOfWork**: نمط وحدة العمل لإدارة المعاملات

### 4. 📁 ElectronicsStore.WebAPI (طبقة الواجهة)

**الغرض**: يحتوي على Controllers و API endpoints

```
ElectronicsStore.WebAPI/
├── 📁 Controllers/                     # وحدات التحكم
│   ├── 📄 AuthController.cs            # تحكم المصادقة
│   ├── 📄 UsersController.cs           # تحكم المستخدمين
│   ├── 📄 ProductsController.cs        # تحكم المنتجات
│   ├── 📄 CategoriesController.cs      # تحكم الفئات
│   ├── 📄 SuppliersController.cs       # تحكم الموردين
│   ├── 📄 InventoryController.cs       # تحكم المخزون
│   ├── 📄 SalesInvoicesController.cs   # تحكم فواتير البيع
│   ├── 📄 PurchaseInvoicesController.cs # تحكم فواتير الشراء
│   ├── 📄 SalesReturnController.cs     # تحكم مرتجعات البيع
│   ├── 📄 PurchaseReturnController.cs  # تحكم مرتجعات الشراء
│   ├── 📄 ReturnsController.cs         # تحكم المرتجعات
│   ├── 📄 ExpensesController.cs        # تحكم المصروفات
│   ├── 📄 PermissionsController.cs     # تحكم الصلاحيات
│   ├── 📄 DashboardController.cs       # تحكم لوحة التحكم
│   └── 📄 FileUploadController.cs      # تحكم رفع الملفات
├── 📁 Middleware/                      # البرمجيات الوسطية
│   └── 📄 ErrorHandlingMiddleware.cs   # معالجة الأخطاء
├── 📁 Extensions/                      # امتدادات التطبيق
├── 📁 Properties/                      # خصائص التطبيق
├── 📁 wwwroot/                         # الملفات الثابتة
├── 📄 Program.cs                       # نقطة البداية
├── 📄 appsettings.json                 # إعدادات التطبيق
├── 📄 appsettings.Development.json     # إعدادات التطوير
├── 📄 ElectronicsStore.WebAPI.csproj   # ملف المشروع
└── 📄 ElectronicsStore.WebAPI.http     # ملف اختبار API
```

**API Endpoints الرئيسية**:
- **Authentication**: `/api/auth/*` - تسجيل الدخول والمصادقة
- **Users**: `/api/users/*` - إدارة المستخدمين
- **Products**: `/api/products/*` - إدارة المنتجات
- **Categories**: `/api/categories/*` - إدارة الفئات
- **Suppliers**: `/api/suppliers/*` - إدارة الموردين
- **Inventory**: `/api/inventory/*` - إدارة المخزون
- **Sales**: `/api/sales/*` - إدارة المبيعات
- **Purchases**: `/api/purchases/*` - إدارة المشتريات
- **Returns**: `/api/returns/*` - إدارة المرتجعات
- **Expenses**: `/api/expenses/*` - إدارة المصروفات
- **Dashboard**: `/api/dashboard/*` - لوحة التحكم

---

## 🎨 Frontend - الواجهة الأمامية

### هيكل React Application

```
Frontend/
├── 📁 src/                             # الكود المصدري
│   ├── 📁 components/                  # مكونات React
│   │   ├── 📁 layout/                  # مكونات التخطيط
│   │   │   ├── 📄 AppHeader.tsx        # رأس التطبيق
│   │   │   ├── 📄 AppSidebar.tsx       # الشريط الجانبي
│   │   │   └── 📄 DashboardLayout.tsx  # تخطيط لوحة التحكم
│   │   ├── 📁 ui/                      # مكونات UI الأساسية
│   │   │   ├── 📄 button.tsx           # مكون الزر
│   │   │   ├── 📄 input.tsx            # مكون الإدخال
│   │   │   ├── 📄 table.tsx            # مكون الجدول
│   │   │   ├── 📄 dialog.tsx           # مكون الحوار
│   │   │   ├── 📄 form.tsx             # مكون النموذج
│   │   │   ├── 📄 card.tsx             # مكون البطاقة
│   │   │   ├── 📄 badge.tsx            # مكون الشارة
│   │   │   ├── 📄 alert.tsx            # مكون التنبيه
│   │   │   ├── 📄 toast.tsx            # مكون الإشعار
│   │   │   ├── 📄 chart.tsx            # مكون الرسم البياني
│   │   │   ├── 📄 calendar.tsx         # مكون التقويم
│   │   │   ├── 📄 dropdown-menu.tsx    # مكون القائمة المنسدلة
│   │   │   ├── 📄 select.tsx           # مكون الاختيار
│   │   │   ├── 📄 tabs.tsx             # مكون التبويبات
│   │   │   ├── 📄 accordion.tsx        # مكون الأكورديون
│   │   │   ├── 📄 checkbox.tsx         # مكون مربع الاختيار
│   │   │   ├── 📄 radio-group.tsx      # مكون مجموعة الراديو
│   │   │   ├── 📄 switch.tsx           # مكون المفتاح
│   │   │   ├── 📄 slider.tsx           # مكون المنزلق
│   │   │   ├── 📄 progress.tsx         # مكون شريط التقدم
│   │   │   ├── 📄 skeleton.tsx         # مكون الهيكل العظمي
│   │   │   ├── 📄 separator.tsx        # مكون الفاصل
│   │   │   ├── 📄 scroll-area.tsx      # مكون منطقة التمرير
│   │   │   ├── 📄 resizable.tsx        # مكون قابل للتغيير
│   │   │   ├── 📄 sidebar.tsx          # مكون الشريط الجانبي
│   │   │   ├── 📄 sheet.tsx            # مكون الورقة
│   │   │   ├── 📄 drawer.tsx           # مكون الدرج
│   │   │   ├── 📄 hover-card.tsx       # مكون بطاقة التمرير
│   │   │   ├── 📄 popover.tsx          # مكون النافذة المنبثقة
│   │   │   ├── 📄 tooltip.tsx          # مكون التلميح
│   │   │   ├── 📄 command.tsx          # مكون الأمر
│   │   │   ├── 📄 menubar.tsx          # مكون شريط القائمة
│   │   │   ├── 📄 navigation-menu.tsx  # مكون قائمة التنقل
│   │   │   ├── 📄 breadcrumb.tsx       # مكون مسار التنقل
│   │   │   ├── 📄 pagination.tsx       # مكون الترقيم
│   │   │   ├── 📄 toggle.tsx           # مكون التبديل
│   │   │   ├── 📄 toggle-group.tsx     # مكون مجموعة التبديل
│   │   │   ├── 📄 context-menu.tsx     # مكون قائمة السياق
│   │   │   ├── 📄 collapsible.tsx      # مكون قابل للطي
│   │   │   ├── 📄 aspect-ratio.tsx     # مكون نسبة العرض
│   │   │   ├── 📄 avatar.tsx           # مكون الصورة الرمزية
│   │   │   ├── 📄 carousel.tsx         # مكون الكاروسيل
│   │   │   ├── 📄 input-otp.tsx        # مكون إدخال OTP
│   │   │   ├── 📄 label.tsx            # مكون التسمية
│   │   │   ├── 📄 textarea.tsx         # مكون منطقة النص
│   │   │   ├── 📄 alert-dialog.tsx     # مكون حوار التنبيه
│   │   │   ├── 📄 sonner.tsx           # مكون الإشعارات
│   │   │   └── 📄 use-toast.ts         # hook للإشعارات
│   │   ├── 📁 auth/                    # مكونات المصادقة
│   │   ├── 📁 dashboard/               # مكونات لوحة التحكم
│   │   ├── 📁 users/                   # مكونات المستخدمين
│   │   ├── 📁 products/                # مكونات المنتجات
│   │   ├── 📁 categories/              # مكونات الفئات
│   │   ├── 📁 suppliers/               # مكونات الموردين
│   │   ├── 📁 inventory/               # مكونات المخزون
│   │   ├── 📁 sales/                   # مكونات المبيعات
│   │   ├── 📁 purchases/               # مكونات المشتريات
│   │   ├── 📁 returns/                 # مكونات المرتجعات
│   │   ├── 📁 expenses/                # مكونات المصروفات
│   │   ├── 📁 reports/                 # مكونات التقارير
│   │   └── 📁 settings/                # مكونات الإعدادات
│   ├── 📁 pages/                       # صفحات التطبيق
│   │   ├── 📄 Index.tsx                # الصفحة الرئيسية
│   │   ├── 📄 NotFound.tsx             # صفحة 404
│   │   ├── 📁 auth/                    # صفحات المصادقة
│   │   │   └── 📄 LoginPage.tsx        # صفحة تسجيل الدخول
│   │   ├── 📁 users/                   # صفحات المستخدمين
│   │   │   └── 📄 UsersPage.tsx        # صفحة إدارة المستخدمين
│   │   ├── 📁 inventory/               # صفحات المخزون
│   │   │   ├── 📄 ProductsPage.tsx     # صفحة المنتجات
│   │   │   ├── 📄 CategoriesPage.tsx   # صفحة الفئات
│   │   │   └── 📄 InventoryDashboard.tsx # لوحة تحكم المخزون
│   │   ├── 📁 suppliers/               # صفحات الموردين
│   │   │   └── 📄 SuppliersPage.tsx    # صفحة الموردين
│   │   ├── 📁 sales/                   # صفحات المبيعات
│   │   │   └── 📄 SalesInvoicesPage.tsx # صفحة فواتير البيع
│   │   ├── 📁 purchases/               # صفحات المشتريات
│   │   │   └── 📄 PurchaseInvoicesPage.tsx # صفحة فواتير الشراء
│   │   ├── 📁 returns/                 # صفحات المرتجعات
│   │   │   └── 📄 ReturnsPage.tsx      # صفحة المرتجعات
│   │   ├── 📁 expenses/                # صفحات المصروفات
│   │   │   └── 📄 ExpensesPage.tsx     # صفحة المصروفات
│   │   ├── 📁 reports/                 # صفحات التقارير
│   │   │   └── 📄 ReportsPage.tsx      # صفحة التقارير
│   │   ├── 📁 pos/                     # صفحات نقطة البيع
│   │   │   └── 📄 POSPage.tsx          # صفحة نقطة البيع
│   │   ├── 📁 audit/                   # صفحات التدقيق
│   │   │   └── 📄 AuditPage.tsx        # صفحة التدقيق
│   │   └── 📁 settings/                # صفحات الإعدادات
│   │       └── 📄 SettingsPage.tsx     # صفحة الإعدادات
│   ├── 📁 contexts/                    # سياقات React
│   │   ├── 📄 AuthContext.tsx          # سياق المصادقة
│   │   └── 📄 ThemeContext.tsx         # سياق الثيم
│   ├── 📁 hooks/                       # Custom Hooks
│   │   ├── 📄 useAuth.tsx              # hook المصادقة
│   │   └── 📄 useApi.ts                # hook API
│   ├── 📁 lib/                         # مكتبات مساعدة
│   │   └── 📄 utils.ts                 # وظائف مساعدة
│   ├── 📁 services/                    # خدمات API
│   │   ├── 📄 api.ts                   # إعدادات API
│   │   ├── 📄 authService.ts           # خدمة المصادقة
│   │   ├── 📄 userService.ts           # خدمة المستخدمين
│   │   ├── 📄 productService.ts        # خدمة المنتجات
│   │   ├── 📄 categoryService.ts       # خدمة الفئات
│   │   ├── 📄 supplierService.ts       # خدمة الموردين
│   │   ├── 📄 inventoryService.ts      # خدمة المخزون
│   │   ├── 📄 salesService.ts          # خدمة المبيعات
│   │   ├── 📄 purchaseService.ts       # خدمة المشتريات
│   │   ├── 📄 returnService.ts         # خدمة المرتجعات
│   │   ├── 📄 expenseService.ts        # خدمة المصروفات
│   │   └── 📄 dashboardService.ts      # خدمة لوحة التحكم
│   ├── 📁 stores/                      # Zustand Stores
│   │   ├── 📄 authStore.ts             # متجر المصادقة
│   │   ├── 📄 userStore.ts             # متجر المستخدمين
│   │   ├── 📄 productStore.ts          # متجر المنتجات
│   │   ├── 📄 categoryStore.ts         # متجر الفئات
│   │   ├── 📄 supplierStore.ts         # متجر الموردين
│   │   ├── 📄 inventoryStore.ts        # متجر المخزون
│   │   ├── 📄 salesStore.ts            # متجر المبيعات
│   │   ├── 📄 purchaseStore.ts         # متجر المشتريات
│   │   ├── 📄 returnStore.ts           # متجر المرتجعات
│   │   ├── 📄 expenseStore.ts          # متجر المصروفات
│   │   └── 📄 dashboardStore.ts        # متجر لوحة التحكم
│   ├── 📁 types/                       # أنواع TypeScript
│   │   ├── 📄 auth.ts                  # أنواع المصادقة
│   │   ├── 📄 user.ts                  # أنواع المستخدمين
│   │   ├── 📄 product.ts               # أنواع المنتجات
│   │   ├── 📄 category.ts              # أنواع الفئات
│   │   ├── 📄 supplier.ts              # أنواع الموردين
│   │   ├── 📄 inventory.ts             # أنواع المخزون
│   │   ├── 📄 sales.ts                 # أنواع المبيعات
│   │   ├── 📄 purchase.ts              # أنواع المشتريات
│   │   ├── 📄 return.ts                # أنواع المرتجعات
│   │   ├── 📄 expense.ts               # أنواع المصروفات
│   │   ├── 📄 dashboard.ts             # أنواع لوحة التحكم
│   │   └── 📄 common.ts                # أنواع مشتركة
│   ├── 📄 App.tsx                      # مكون التطبيق الرئيسي
│   ├── 📄 App.css                      # أنماط التطبيق
│   ├── 📄 main.tsx                     # نقطة البداية
│   ├── 📄 index.css                    # الأنماط العامة
│   └── 📄 vite-env.d.ts                # تعريفات Vite
├── 📁 public/                          # الملفات العامة
│   ├── 📄 favicon.ico                  # أيقونة الموقع
│   ├── 📄 placeholder.svg              # صورة بديلة
│   └── 📄 robots.txt                   # ملف robots
├── 📄 package.json                     # إعدادات المشروع
├── 📄 package-lock.json                # قفل التبعيات
├── 📄 bun.lockb                        # قفل Bun
├── 📄 vite.config.ts                   # إعدادات Vite
├── 📄 tsconfig.json                    # إعدادات TypeScript
├── 📄 tsconfig.app.json                # إعدادات TypeScript للتطبيق
├── 📄 tsconfig.node.json               # إعدادات TypeScript لـ Node
├── 📄 tailwind.config.ts               # إعدادات Tailwind CSS
├── 📄 postcss.config.js                # إعدادات PostCSS
├── 📄 components.json                  # إعدادات shadcn/ui
├── 📄 eslint.config.js                 # إعدادات ESLint
└── 📄 README.md                        # دليل المشروع
```

### المكونات الرئيسية:

#### 1. 📁 Components (المكونات)
- **Layout Components**: مكونات التخطيط الأساسية
- **UI Components**: مكونات واجهة المستخدم من shadcn/ui
- **Feature Components**: مكونات خاصة بكل وحدة وظيفية

#### 2. 📁 Pages (الصفحات)
- **Authentication**: صفحات تسجيل الدخول والمصادقة
- **Dashboard**: لوحة التحكم الرئيسية
- **Inventory Management**: إدارة المخزون والمنتجات
- **Sales Management**: إدارة المبيعات والفواتير
- **Purchase Management**: إدارة المشتريات والموردين
- **Returns Management**: إدارة المرتجعات
- **Expenses Management**: إدارة المصروفات
- **Reports**: التقارير والإحصائيات
- **Settings**: الإعدادات العامة

#### 3. 📁 Services (الخدمات)
- **API Services**: خدمات الاتصال بالخادم الخلفي
- **Auth Service**: خدمة المصادقة وإدارة الجلسات
- **Data Services**: خدمات إدارة البيانات

#### 4. 📁 Stores (المتاجر)
- **Zustand Stores**: إدارة الحالة العالمية
- **Feature Stores**: متاجر خاصة بكل وحدة وظيفية

---

## 🗄️ Database - قاعدة البيانات

### ملفات قاعدة البيانات

```
Database/
├── 📄 DatabaseSchema.sql               # مخطط قاعدة البيانات الأساسي
├── 📄 ElectronicsStoreDB_Schema.sql    # مخطط قاعدة البيانات الكامل
├── 📄 DatabaseViews.sql                # عرض قاعدة البيانات
└── 📄 AddImageColumnToUsers.sql        # إضافة عمود الصور للمستخدمين
```

### الجداول الرئيسية:

#### 1. **Users Table** (جدول المستخدمين)
- `Id` - المعرف الفريد
- `Username` - اسم المستخدم
- `Email` - البريد الإلكتروني
- `PasswordHash` - هاش كلمة المرور
- `FirstName` - الاسم الأول
- `LastName` - الاسم الأخير
- `PhoneNumber` - رقم الهاتف
- `IsActive` - حالة النشاط
- `CreatedAt` - تاريخ الإنشاء
- `UpdatedAt` - تاريخ التحديث
- `Image` - صورة المستخدم

#### 2. **Roles Table** (جدول الأدوار)
- `Id` - المعرف الفريد
- `Name` - اسم الدور
- `Description` - وصف الدور
- `CreatedAt` - تاريخ الإنشاء

#### 3. **Products Table** (جدول المنتجات)
- `Id` - المعرف الفريد
- `Name` - اسم المنتج
- `Description` - وصف المنتج
- `SKU` - رمز المنتج
- `Price` - السعر
- `Cost` - التكلفة
- `StockQuantity` - كمية المخزون
- `MinStockLevel` - الحد الأدنى للمخزون
- `CategoryId` - معرف الفئة
- `SupplierId` - معرف المورد
- `IsActive` - حالة النشاط
- `CreatedAt` - تاريخ الإنشاء
- `UpdatedAt` - تاريخ التحديث

#### 4. **Categories Table** (جدول الفئات)
- `Id` - المعرف الفريد
- `Name` - اسم الفئة
- `Description` - وصف الفئة
- `ParentId` - معرف الفئة الأب
- `IsActive` - حالة النشاط
- `CreatedAt` - تاريخ الإنشاء
- `UpdatedAt` - تاريخ التحديث

#### 5. **Suppliers Table** (جدول الموردين)
- `Id` - المعرف الفريد
- `Name` - اسم المورد
- `ContactPerson` - الشخص المسؤول
- `Email` - البريد الإلكتروني
- `PhoneNumber` - رقم الهاتف
- `Address` - العنوان
- `IsActive` - حالة النشاط
- `CreatedAt` - تاريخ الإنشاء
- `UpdatedAt` - تاريخ التحديث

#### 6. **SalesInvoices Table** (جدول فواتير البيع)
- `Id` - المعرف الفريد
- `InvoiceNumber` - رقم الفاتورة
- `CustomerName` - اسم العميل
- `CustomerPhone` - هاتف العميل
- `TotalAmount` - المبلغ الإجمالي
- `DiscountAmount` - مبلغ الخصم
- `TaxAmount` - مبلغ الضريبة
- `NetAmount` - المبلغ الصافي
- `PaymentMethod` - طريقة الدفع
- `Status` - حالة الفاتورة
- `CreatedBy` - منشئ الفاتورة
- `CreatedAt` - تاريخ الإنشاء
- `UpdatedAt` - تاريخ التحديث

#### 7. **PurchaseInvoices Table** (جدول فواتير الشراء)
- `Id` - المعرف الفريد
- `InvoiceNumber` - رقم الفاتورة
- `SupplierId` - معرف المورد
- `TotalAmount` - المبلغ الإجمالي
- `DiscountAmount` - مبلغ الخصم
- `TaxAmount` - مبلغ الضريبة
- `NetAmount` - المبلغ الصافي
- `PaymentMethod` - طريقة الدفع
- `Status` - حالة الفاتورة
- `CreatedBy` - منشئ الفاتورة
- `CreatedAt` - تاريخ الإنشاء
- `UpdatedAt` - تاريخ التحديث

#### 8. **Returns Table** (جدول المرتجعات)
- `Id` - المعرف الفريد
- `ReturnNumber` - رقم المرتجع
- `Type` - نوع المرتجع (بيع/شراء)
- `ReferenceId` - معرف المرجع
- `ProductId` - معرف المنتج
- `Quantity` - الكمية
- `Reason` - سبب المرتجع
- `Status` - حالة المرتجع
- `CreatedBy` - منشئ المرتجع
- `CreatedAt` - تاريخ الإنشاء
- `UpdatedAt` - تاريخ التحديث

#### 9. **Expenses Table** (جدول المصروفات)
- `Id` - المعرف الفريد
- `Description` - وصف المصروف
- `Amount` - المبلغ
- `Category` - فئة المصروف
- `Date` - تاريخ المصروف
- `CreatedBy` - منشئ المصروف
- `CreatedAt` - تاريخ الإنشاء
- `UpdatedAt` - تاريخ التحديث

#### 10. **InventoryLogs Table** (جدول سجلات المخزون)
- `Id` - المعرف الفريد
- `ProductId` - معرف المنتج
- `Type` - نوع العملية
- `Quantity` - الكمية
- `PreviousStock` - المخزون السابق
- `NewStock` - المخزون الجديد
- `ReferenceId` - معرف المرجع
- `Notes` - ملاحظات
- `CreatedBy` - منشئ السجل
- `CreatedAt` - تاريخ الإنشاء

---

## 🔧 التقنيات المستخدمة

### Backend Technologies:
- **.NET 9.0** - إطار العمل الأساسي
- **ASP.NET Core Web API** - واجهة برمجة التطبيقات
- **Entity Framework Core** - ORM للوصول للبيانات
- **SQL Server** - قاعدة البيانات
- **JWT Bearer Authentication** - المصادقة
- **AutoMapper** - تعيين الكائنات
- **Swagger/OpenAPI** - توثيق API
- **CORS** - مشاركة الموارد عبر المصادر

### Frontend Technologies:
- **React 18** - مكتبة واجهة المستخدم
- **TypeScript** - لغة البرمجة
- **Vite** - أداة البناء
- **Tailwind CSS** - إطار عمل CSS
- **shadcn/ui** - مكتبة مكونات UI
- **React Router DOM** - التوجيه
- **Zustand** - إدارة الحالة
- **Axios** - عميل HTTP
- **React Hook Form** - إدارة النماذج
- **Zod** - التحقق من البيانات
- **Recharts** - الرسوم البيانية
- **Lucide React** - الأيقونات
- **Date-fns** - معالجة التواريخ

### Development Tools:
- **Visual Studio 2022** - بيئة التطوير
- **Visual Studio Code** - محرر النصوص
- **Git** - إدارة الإصدارات
- **Postman** - اختبار API
- **SQL Server Management Studio** - إدارة قاعدة البيانات

---

## 🚀 خطوات التشغيل

### 1. إعداد Backend

```bash
# الانتقال لمجلد Backend
cd Backend

# استعادة الحزم
dotnet restore

# تشغيل قاعدة البيانات
# تحديث قاعدة البيانات
dotnet ef database update

# تشغيل التطبيق
dotnet run --project ElectronicsStore.WebAPI
```

### 2. إعداد Frontend

```bash
# الانتقال لمجلد Frontend
cd Frontend

# تثبيت التبعيات
npm install

# تشغيل التطبيق
npm run dev
```

### 3. إعداد قاعدة البيانات

```sql
-- تشغيل ملفات SQL في Database/
-- 1. DatabaseSchema.sql
-- 2. ElectronicsStoreDB_Schema.sql
-- 3. DatabaseViews.sql
-- 4. AddImageColumnToUsers.sql
```

---

## 📊 الميزات الرئيسية

### 1. إدارة المستخدمين
- ✅ تسجيل الدخول والخروج
- ✅ إدارة الصلاحيات والأدوار
- ✅ إضافة وتعديل وحذف المستخدمين
- ✅ رفع صور المستخدمين

### 2. إدارة المنتجات
- ✅ إضافة وتعديل وحذف المنتجات
- ✅ إدارة الفئات والتصنيفات
- ✅ تتبع المخزون والكميات
- ✅ إدارة الموردين

### 3. إدارة المبيعات
- ✅ إنشاء فواتير البيع
- ✅ إدارة العملاء
- ✅ تتبع المدفوعات
- ✅ طباعة الفواتير

### 4. إدارة المشتريات
- ✅ إنشاء فواتير الشراء
- ✅ إدارة الموردين
- ✅ تتبع المدفوعات
- ✅ إدارة المخزون

### 5. إدارة المرتجعات
- ✅ مرتجعات البيع
- ✅ مرتجعات الشراء
- ✅ تتبع أسباب المرتجعات
- ✅ إدارة حالات المرتجعات

### 6. إدارة المصروفات
- ✅ تسجيل المصروفات
- ✅ تصنيف المصروفات
- ✅ تتبع المبالغ
- ✅ تقارير المصروفات

### 7. التقارير والإحصائيات
- ✅ تقارير المبيعات
- ✅ تقارير المشتريات
- ✅ تقارير المخزون
- ✅ تقارير الأرباح والخسائر
- ✅ رسوم بيانية تفاعلية

### 8. لوحة التحكم
- ✅ إحصائيات عامة
- ✅ مؤشرات الأداء
- ✅ الأنشطة الحديثة
- ✅ تنبيهات المخزون

---

## 🔐 الأمان

### 1. المصادقة والتفويض
- **JWT Bearer Token** للمصادقة
- **Role-based Authorization** للتفويض
- **Password Hashing** لتشفير كلمات المرور
- **Session Management** لإدارة الجلسات

### 2. حماية البيانات
- **HTTPS** للاتصالات الآمنة
- **CORS** لمشاركة الموارد
- **Input Validation** للتحقق من المدخلات
- **SQL Injection Protection** حماية من حقن SQL

### 3. إدارة الأخطاء
- **Global Error Handling** معالجة الأخطاء العامة
- **Logging** تسجيل الأحداث
- **User-friendly Error Messages** رسائل خطأ واضحة

---

## 📱 التصميم المتجاوب

### 1. دعم الأجهزة
- **Desktop** - أجهزة سطح المكتب
- **Tablet** - الأجهزة اللوحية
- **Mobile** - الهواتف الذكية

### 2. الميزات
- **RTL Support** - دعم اللغة العربية
- **Dark/Light Mode** - الوضع المظلم والفاتح
- **Responsive Design** - التصميم المتجاوب
- **Accessibility** - إمكانية الوصول

---

## 🧪 الاختبار

### 1. Backend Testing
- **Unit Tests** - اختبارات الوحدة
- **Integration Tests** - اختبارات التكامل
- **API Tests** - اختبارات API

### 2. Frontend Testing
- **Component Tests** - اختبارات المكونات
- **Integration Tests** - اختبارات التكامل
- **E2E Tests** - اختبارات النهاية للنهاية

---

## 📈 الأداء

### 1. Backend Optimization
- **Entity Framework Optimization** - تحسين Entity Framework
- **Caching** - التخزين المؤقت
- **Database Indexing** - فهرسة قاعدة البيانات
- **Query Optimization** - تحسين الاستعلامات

### 2. Frontend Optimization
- **Code Splitting** - تقسيم الكود
- **Lazy Loading** - التحميل البطيء
- **Image Optimization** - تحسين الصور
- **Bundle Optimization** - تحسين الحزم

---

## 🔄 التطوير المستمر

### 1. CI/CD Pipeline
- **Automated Testing** - الاختبار التلقائي
- **Automated Deployment** - النشر التلقائي
- **Code Quality Checks** - فحص جودة الكود
- **Security Scanning** - فحص الأمان

### 2. Monitoring
- **Application Performance Monitoring** - مراقبة أداء التطبيق
- **Error Tracking** - تتبع الأخطاء
- **User Analytics** - تحليلات المستخدمين
- **System Health** - صحة النظام

---

## 📚 الوثائق

### 1. API Documentation
- **Swagger/OpenAPI** - توثيق API تفاعلي
- **Postman Collection** - مجموعة Postman
- **API Examples** - أمثلة API

### 2. User Documentation
- **User Manual** - دليل المستخدم
- **Admin Guide** - دليل الإدارة
- **Developer Guide** - دليل المطور

---

## 🤝 المساهمة

### 1. إرشادات المساهمة
- **Code Style** - نمط الكود
- **Commit Messages** - رسائل الالتزام
- **Pull Request Process** - عملية طلب السحب
- **Testing Requirements** - متطلبات الاختبار

### 2. إدارة المشروع
- **Issue Tracking** - تتبع المشاكل
- **Feature Requests** - طلبات الميزات
- **Release Planning** - تخطيط الإصدارات
- **Roadmap** - خارطة الطريق

---

## 📞 الدعم والمساعدة

### 1. قنوات الدعم
- **GitHub Issues** - مشاكل GitHub
- **Documentation** - الوثائق
- **Community Forum** - منتدى المجتمع
- **Email Support** - دعم البريد الإلكتروني

### 2. الموارد
- **Tutorials** - دروس تعليمية
- **Video Guides** - أدلة الفيديو
- **Code Examples** - أمثلة الكود
- **Best Practices** - أفضل الممارسات

---

## 🎯 الخلاصة

هذا المشروع هو نظام إدارة متجر إلكترونيات متكامل وشامل يوفر:

1. **معمارية نظيفة** مع فصل الطبقات
2. **واجهة مستخدم حديثة** ومتجاوبة
3. **إدارة شاملة** لجميع عمليات المتجر
4. **أمان عالي** وحماية البيانات
5. **قابلية التوسع** والصيانة
6. **وثائق شاملة** ودعم فني

المشروع جاهز للاستخدام في بيئة الإنتاج ويمكن تطويره وإضافة ميزات جديدة حسب الحاجة.

---

**تم إنشاء هذا التوثيق في:** `{new Date().toLocaleDateString('ar-SA')}`  
**إصدار المشروع:** `1.0.0`  
**المطور:** فريق التطوير  
**الترخيص:** MIT License
F:\مشاريع\Finnal_Project\Frontend\src\pages\auth\LoginPage.tsx
