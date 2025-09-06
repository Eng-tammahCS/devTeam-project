# دليل ربط React مع ASP.NET Core Web API

## 📋 نظرة عامة

تم إنشاء نظام API شامل لربط React (Vite + TypeScript + Tailwind + shadcn-ui) مع ASP.NET Core Web API لنظام إدارة متجر الإلكترونيات.

## 🗂️ هيكل الملفات

```
src/
├── lib/
│   └── api.ts                 # Axios instance مع دعم التوكن
├── services/
│   ├── auth.ts               # خدمات المصادقة
│   ├── products.ts           # خدمات المنتجات
│   ├── categories.ts         # خدمات الفئات
│   ├── users.ts              # خدمات المستخدمين
│   ├── suppliers.ts          # خدمات الموردين
│   ├── invoices.ts           # خدمات الفواتير
│   ├── dashboard.ts          # خدمات لوحة التحكم
│   └── index.ts              # تصدير جميع الخدمات
├── types/
│   └── index.ts              # TypeScript types
├── config/
│   └── env.ts                # إعدادات البيئة
└── components/
    └── TestApi.tsx           # مكون اختبار API
```

## 🚀 خطوات التشغيل

### 1. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```env
# API Configuration
VITE_API_BASE_URL=https://localhost:7043

# Development Settings
VITE_APP_NAME=Electronics Store Management
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# API Timeout (in milliseconds)
VITE_API_TIMEOUT=10000

# Enable/Disable features
VITE_ENABLE_DEBUG_LOGS=true
VITE_ENABLE_API_LOGGING=true
```

### 2. تثبيت التبعيات

```bash
npm install axios
# أو
yarn add axios
```

### 3. تشغيل المشروع

```bash
# تشغيل Backend (ASP.NET Core)
cd backend
dotnet run

# تشغيل Frontend (React)
cd frontend
npm run dev
# أو
yarn dev
```

### 4. اختبار الاتصال

استخدم مكون `TestApi` لاختبار الاتصال:

```tsx
import TestApi from '@/components/TestApi';

function App() {
  return (
    <div>
      <TestApi />
    </div>
  );
}
```

## 🔧 الاستخدام

### مثال على استخدام خدمات المصادقة

```tsx
import { authService } from '@/services';

// تسجيل الدخول
const handleLogin = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    if (response.success) {
      // حفظ التوكن
      localStorage.setItem('authToken', response.data.token);
      console.log('تم تسجيل الدخول بنجاح');
    }
  } catch (error) {
    console.error('فشل في تسجيل الدخول:', error);
  }
};
```

### مثال على استخدام خدمات المنتجات

```tsx
import { productsService } from '@/services';

// الحصول على جميع المنتجات
const fetchProducts = async () => {
  try {
    const response = await productsService.getAll();
    console.log('المنتجات:', response.data);
  } catch (error) {
    console.error('خطأ في جلب المنتجات:', error);
  }
};

// إنشاء منتج جديد
const createProduct = async (productData) => {
  try {
    const response = await productsService.create(productData);
    console.log('تم إنشاء المنتج:', response.data);
  } catch (error) {
    console.error('خطأ في إنشاء المنتج:', error);
  }
};
```

### مثال على استخدام خدمات لوحة التحكم

```tsx
import { dashboardService } from '@/services';

// الحصول على إحصائيات لوحة التحكم
const fetchDashboardStats = async () => {
  try {
    const response = await dashboardService.getStats();
    console.log('الإحصائيات:', response.data);
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
  }
};
```

## 🔐 إدارة التوكن

```tsx
import { authUtils } from '@/services';

// التحقق من حالة المصادقة
if (authUtils.isAuthenticated()) {
  console.log('المستخدم مسجل الدخول');
}

// إزالة التوكن
authUtils.removeToken();
```

## 📊 أنواع البيانات

جميع أنواع البيانات متوفرة في `src/types/index.ts`:

```tsx
import type { 
  User, 
  Product, 
  Category, 
  Supplier,
  SalesInvoice,
  DashboardStats 
} from '@/types';
```

## 🛠️ الميزات المتوفرة

### ✅ خدمات المصادقة
- تسجيل الدخول والخروج
- إنشاء حساب جديد
- تحديث الرمز المميز
- التحقق من صحة الرمز
- تغيير كلمة المرور

### ✅ خدمات المنتجات
- CRUD operations
- البحث بالباركود
- البحث بالفئة أو المورد
- إحصائيات المنتجات

### ✅ خدمات الفئات
- CRUD operations
- البحث والتصفية
- إحصائيات الفئات

### ✅ خدمات المستخدمين
- CRUD operations
- إدارة الصلاحيات
- رفع الصور
- البحث والتصفية

### ✅ خدمات الموردين
- CRUD operations
- إحصائيات الموردين
- تتبع المشتريات

### ✅ خدمات الفواتير
- فواتير البيع والشراء
- البحث والتصفية
- التصدير والطباعة

### ✅ خدمات لوحة التحكم
- إحصائيات شاملة
- الأنشطة الحديثة
- التنبيهات
- تقارير الأداء

## 🔧 التخصيص

### إضافة خدمة جديدة

```tsx
// src/services/newService.ts
import { apiClient } from '../lib/api';

export const newService = {
  getAll: async () => {
    return apiClient.get('/api/new-endpoint');
  },
  
  create: async (data) => {
    return apiClient.post('/api/new-endpoint', data);
  },
};
```

### إضافة نوع بيانات جديد

```tsx
// src/types/index.ts
export interface NewEntity extends BaseEntity {
  name: string;
  description: string;
}
```

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ CORS**: تأكد من إعداد CORS في ASP.NET Core
2. **خطأ 401**: تحقق من صحة التوكن
3. **خطأ 404**: تأكد من صحة مسار الـ endpoint
4. **خطأ الشبكة**: تحقق من تشغيل Backend

### سجلات التصحيح

```tsx
// تفعيل سجلات التصحيح
localStorage.setItem('debug', 'true');
```

## 📝 ملاحظات مهمة

1. جميع الطلبات تتطلب مصادقة باستثناء endpoints المصادقة
2. التوكن يتم حفظه في localStorage
3. يتم إعادة توجيه المستخدم لصفحة تسجيل الدخول عند انتهاء صلاحية التوكن
4. جميع التواريخ بتنسيق ISO 8601
5. جميع الاستجابات بتنسيق JSON

## 🔄 التحديثات المستقبلية

- [ ] إضافة دعم WebSocket للتنبيهات المباشرة
- [ ] إضافة نظام cache للبيانات
- [ ] إضافة دعم التصدير المتقدم
- [ ] إضافة نظام الإشعارات
- [ ] إضافة دعم الملفات المتعددة

## 📞 الدعم

للمساعدة أو الاستفسارات، يرجى مراجعة:
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [React Documentation](https://reactjs.org/docs/)
- [Axios Documentation](https://axios-http.com/docs/intro)


