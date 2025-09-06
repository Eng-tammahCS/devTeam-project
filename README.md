# نظام إدارة متجر الإلكترونيات - Frontend

نظام إدارة متجر الإلكترونيات مبني بـ React + TypeScript + Tailwind CSS + shadcn-ui ومرتبط بـ ASP.NET Core Web API.

## 🚀 الميزات

- ✅ **إدارة المستخدمين** - CRUD كامل مع الصلاحيات
- ✅ **إدارة المنتجات** - إضافة، تعديل، حذف، بحث
- ✅ **إدارة الفئات** - تنظيم المنتجات
- ✅ **إدارة الموردين** - تتبع الموردين والمشتريات
- ✅ **لوحة التحكم** - إحصائيات شاملة ورسوم بيانية
- ✅ **نظام المصادقة** - تسجيل دخول آمن
- ✅ **API Integration** - مرتبط بالكامل مع Backend
- ✅ **Responsive Design** - يعمل على جميع الأجهزة
- ✅ **TypeScript** - نوعية بيانات قوية
- ✅ **State Management** - Zustand للتحكم في الحالة

## 🛠️ التقنيات المستخدمة

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn-ui
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📁 هيكل المشروع

```
src/
├── components/           # مكونات React
│   ├── auth/            # مكونات المصادقة
│   ├── dashboard/       # لوحة التحكم
│   ├── users/           # إدارة المستخدمين
│   ├── products/        # إدارة المنتجات
│   ├── categories/      # إدارة الفئات
│   ├── layout/          # تخطيط الصفحات
│   └── ui/              # مكونات UI أساسية
├── stores/              # Zustand stores
├── services/            # API services
├── types/               # TypeScript types
├── lib/                 # مكتبات مساعدة
├── hooks/               # Custom hooks
└── config/              # إعدادات التطبيق
```

## 🚀 خطوات التشغيل

### 1. تثبيت التبعيات

```bash
npm install
# أو
yarn install
```

### 2. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```env
VITE_API_BASE_URL=https://localhost:7043
VITE_APP_NAME=Electronics Store Management
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
VITE_API_TIMEOUT=10000
VITE_ENABLE_DEBUG_LOGS=true
VITE_ENABLE_API_LOGGING=true
```

### 3. تشغيل Backend

تأكد من تشغيل ASP.NET Core API على `https://localhost:7043`

```bash
cd backend
dotnet run
```

### 4. تشغيل Frontend

```bash
npm run dev
# أو
yarn dev
```

سيعمل التطبيق على `http://localhost:5173`

## 🔐 بيانات تسجيل الدخول التجريبية

- **اسم المستخدم**: admin
- **كلمة المرور**: password123

## 📱 الصفحات المتوفرة

- **لوحة التحكم** (`/`) - نظرة عامة على النظام
- **المستخدمين** (`/users`) - إدارة المستخدمين
- **المنتجات** (`/products`) - إدارة المنتجات
- **الفئات** (`/categories`) - إدارة فئات المنتجات
- **اختبار API** (`/test-api`) - اختبار الاتصال مع Backend

## 🔧 الميزات التقنية

### State Management
- **Zustand** لإدارة الحالة العالمية
- Stores منفصلة لكل وحدة (users, products, categories, dashboard)
- Persistence للحفاظ على بيانات المستخدم

### API Integration
- **Axios** للطلبات HTTP
- Interceptors لإدارة التوكن والأخطاء
- TypeScript types لجميع البيانات

### UI Components
- **shadcn-ui** مكونات UI جاهزة
- **Tailwind CSS** للتصميم
- **Lucide React** للأيقونات
- Responsive design

### TypeScript
- أنواع بيانات شاملة
- Type safety في جميع أنحاء التطبيق
- IntelliSense محسن

## 🎨 التصميم

- **Modern UI** - تصميم عصري وجذاب
- **RTL Support** - دعم اللغة العربية
- **Dark/Light Mode** - وضعين للعرض
- **Responsive** - يعمل على جميع الأجهزة
- **Accessibility** - متوافق مع معايير الوصول

## 🔄 API Endpoints المستخدمة

### Authentication
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - بيانات المستخدم الحالي

### Users
- `GET /api/users` - جلب المستخدمين
- `POST /api/users` - إنشاء مستخدم
- `PUT /api/users/{id}` - تحديث مستخدم
- `DELETE /api/users/{id}` - حذف مستخدم

### Products
- `GET /api/products` - جلب المنتجات
- `POST /api/products` - إنشاء منتج
- `PUT /api/products/{id}` - تحديث منتج
- `DELETE /api/products/{id}` - حذف منتج

### Categories
- `GET /api/categories` - جلب الفئات
- `POST /api/categories` - إنشاء فئة
- `PUT /api/categories/{id}` - تحديث فئة
- `DELETE /api/categories/{id}` - حذف فئة

### Dashboard
- `GET /api/dashboard/stats` - إحصائيات عامة
- `GET /api/dashboard/recent-activities` - الأنشطة الحديثة
- `GET /api/dashboard/top-products` - أفضل المنتجات

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ CORS**
   - تأكد من إعداد CORS في ASP.NET Core
   - تحقق من URL الصحيح في `.env.local`

2. **خطأ 401 Unauthorized**
   - تحقق من صحة التوكن
   - تأكد من تسجيل الدخول

3. **خطأ 404 Not Found**
   - تأكد من تشغيل Backend
   - تحقق من صحة مسار الـ endpoint

4. **خطأ الشبكة**
   - تحقق من اتصال الإنترنت
   - تأكد من تشغيل Backend على المنفذ الصحيح

### سجلات التصحيح

```bash
# تفعيل سجلات التصحيح
VITE_ENABLE_DEBUG_LOGS=true
VITE_ENABLE_API_LOGGING=true
```

## 📦 بناء المشروع للإنتاج

```bash
npm run build
# أو
yarn build
```

الملفات المبنية ستكون في مجلد `dist/`

## 🚀 نشر المشروع

```bash
# معاينة الإنتاج
npm run preview
# أو
yarn preview
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء branch للميزة الجديدة
3. Commit التغييرات
4. Push إلى Branch
5. إنشاء Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 📞 الدعم

للمساعدة أو الاستفسارات:
- إنشاء Issue في GitHub
- مراجعة الوثائق
- التواصل مع فريق التطوير

## 🔄 التحديثات المستقبلية

- [ ] إضافة نظام الإشعارات
- [ ] دعم الملفات المتعددة
- [ ] تحسين الأداء
- [ ] إضافة المزيد من التقارير
- [ ] دعم التصدير المتقدم
- [ ] نظام النسخ الاحتياطي

---

**تم تطوير هذا المشروع بـ ❤️ باستخدام أحدث التقنيات**

